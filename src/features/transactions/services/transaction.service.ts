import {
  CreateTransactionInput,
  GetTransactionsInput,
  TransactionRead,
  UserRead,
} from "@/@types";
import {
  Timestamp,
  collection,
  doc,
  increment,
  runTransaction,
} from "firebase/firestore";

import { AppError } from "@/utils/app-error";
import { calculatePoints } from "@/utils/points-engine";
import { db } from "@/lib/firebase/firestore";
import { getTransactionsRepository } from "../repositories/transaction.repository";

export async function createTransactionService(data: CreateTransactionInput) {
  const { transactionId, customerId } = data;

  const transactionResult = await runTransaction(db, async (tx) => {
    const qrRef = doc(db, "qr_transactions", transactionId);
    const customerRef = doc(db, "users", customerId);

    const qrSnap = await tx.get(qrRef);

    if (!qrSnap.exists())
      throw new AppError("QR_CODE_NOT_FOUND", "QR Code nao encontrado", 404);

    const qrTransaction = qrSnap.data() as TransactionRead;

    if (qrTransaction.usedAt)
      throw new AppError("USED_QR_CODE", "Esse QR Code ja foi utilizado", 403);

    const now = Timestamp.now();

    if (now.toMillis() > qrTransaction.expiresAt.toMillis())
      throw new AppError("EXPIRED_QR_CODE", "Esse QR Code expirou", 400);

    const customerSnap = await tx.get(customerRef);

    if (!customerSnap.exists())
      throw new AppError("USER_NOT_FOUND", "Usuario nao encontrado", 404);

    const customer = customerSnap.data() as UserRead;

    const earnedPoints = calculatePoints(qrTransaction.amount, customer.level);

    tx.update(customerRef, {
      points: increment(earnedPoints),
      totalPointsEarned: increment(earnedPoints),
      updatedAt: now,
    });

    tx.update(qrRef, { usedAt: now, updatedAt: now });

    const transactionRef = doc(collection(db, "transactions"));

    const customerTransaction = {
      customerId,
      ...qrTransaction,
      qrTransactionId: qrSnap.id,
      usedAt: now,
      version: 1,
    };

    tx.set(transactionRef, customerTransaction);

    return customerTransaction;
  });

  return transactionResult;
}

export async function getTransactionsService({
  filters,
  limit,
  cursor,
}: GetTransactionsInput) {
  if (limit <= 0) {
    throw new AppError(
      "INVALID_LIMIT",
      "O limite deve ser maior que zero",
      400,
    );
  }

  if (limit > 100) {
    throw new AppError(
      "LIMIT_EXCEEDED",
      "O limite máximo permitido é 100",
      400,
    );
  }

  const transactions = await getTransactionsRepository({
    filters: { ...filters, customerId: filters?.customerId },
    limit,
    cursor,
  });

  return transactions;
}
