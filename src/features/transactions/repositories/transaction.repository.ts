import {
  GetTransactionsInput,
  TransactionBase,
  TransactionRead,
} from "@/@types";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";

const TRANSACTIONS_COLLECTION = "transactions";

const transactionsCollection = () => collection(db, TRANSACTIONS_COLLECTION);

export async function createTransactionRepository(data: TransactionBase) {
  const transactionRef = await addDoc(transactionsCollection(), data);

  await runTransaction(db, async (tx) => {
    const transactionDoc = await tx.get(transactionRef);

    if (transactionDoc.exists()) {
      throw new Error("QR Code ja utilizado");
    }

    tx.set(transactionRef, {
      ...data,
      qrTransactionId: transactionRef.id,
    });
  });

  return { id: transactionRef.id, data };
}

export async function getTransactionsRepository({
  limit: pageSize,
  cursor,
}: GetTransactionsInput) {
  let q;

  if (cursor) {
    q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(pageSize + 1),
    );
  } else {
    q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc"),
      limit(pageSize + 1),
    );
  }

  const snapshot = await getDocs(q);

  const hasMore = snapshot.docs.length > pageSize;

  const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;

  const lastVisible = docs[docs.length - 1];

  const transactions = docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TransactionRead[];

  return { transactions, cursor: lastVisible, hasMore };
}
