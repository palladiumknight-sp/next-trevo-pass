import { Timestamp, collection, doc, runTransaction } from "firebase/firestore";

import { AppError } from "@/utils/app-error";
import { CreateTransactionInput } from "@/@types";
import { db } from "@/lib/firebase/firestore";

export async function createTransactionService(data: CreateTransactionInput) {
  const { transactionId, customerId } = data;

  const transactionResult = await runTransaction(db, async (tx) => {
    const qrRef = doc(db, "qr_transactions", transactionId);
    const qrSnap = await tx.get(qrRef);

    if (!qrSnap.exists())
      throw new AppError("QR_CODE_NOT_FOUND", "QR Code nao encontrado", 404);
    const qrTransaction = qrSnap.data();

    const now = Timestamp.now();

    if (qrTransaction.usedAt)
      throw new AppError("USED_QR_CODE", "Esse QR Code ja foi utilizado", 403);
    if (now.toMillis() > qrTransaction.expiresAt.toMillis())
      throw new AppError("EXPIRED_QR_CODE", "Esse QR Code expirou", 400);

    tx.update(qrRef, { usedAt: now });

    const customerTransaction = {
      customerId,
      ...qrTransaction,
      qrTransactionId: qrSnap.id,
      usedAt: now,
      version: 1,
    };

    const transactionRef = doc(collection(db, "transactions"));
    tx.set(transactionRef, customerTransaction);

    return { id: transactionRef.id, ...customerTransaction };
  });

  return transactionResult;
}
