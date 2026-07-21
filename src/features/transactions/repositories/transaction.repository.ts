import {
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  where,
} from "firebase/firestore";
import {
  GetTransactionsInput,
  TransactionBase,
  TransactionRead,
} from "@/@types";

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
  filters,
  limit: pageSize,
  cursor,
}: GetTransactionsInput) {
  const constraints: QueryConstraint[] = [];

  if (filters?.customerId) {
    constraints.push(where("customerId", "==", filters.customerId));
  }

  if (filters?.employeeId) {
    constraints.push(where("employeeId", "==", filters.employeeId));
  }

  if (filters?.campaignId) {
    constraints.push(where("campaignId", "==", filters.campaignId));
  }

  if (filters?.rewardId) {
    constraints.push(where("rewardId", "==", filters.rewardId));
  }

  if (filters?.event) {
    constraints.push(where("event", "==", filters.event));
  }

  if (filters?.status) {
    constraints.push(where("status", "==", filters.status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize + 1));

  const q = query(collection(db, "transactions"), ...constraints);

  const snapshot = await getDocs(q);

  const hasMore = snapshot.docs.length > pageSize;

  const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;

  const transactions: TransactionRead[] = docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TransactionRead[];

  const nextCursor = hasMore ? docs[docs.length - 1] : null;

  return {
    transactions,
    cursor: nextCursor,
    hasMore,
  };
}
