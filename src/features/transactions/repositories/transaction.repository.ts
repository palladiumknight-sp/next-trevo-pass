import {
  CreateTransactionInput,
  GetTransactionsInput,
  TransactionRead,
  UserRead,
} from "@/@types";
import {
  QueryConstraint,
  Timestamp,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  where,
} from "firebase/firestore";

import { AppError } from "@/utils/app-error";
import { calculatePoints } from "@/utils/points-engine";
import { db } from "@/lib/firebase/firestore";

const TRANSACTIONS_COLLECTION = "transactions";
const transactionsCollection = () => collection(db, TRANSACTIONS_COLLECTION);

const USER_COLLECTION = "users";
const usersCollection = () => collection(db, USER_COLLECTION);

const QR_TRANSACTIONS_COLLECTION = "qr_transactions";
const qrTransactionsCollection = () =>
  collection(db, QR_TRANSACTIONS_COLLECTION);

export async function createTransactionRepository({
  qrTransactionId,
  userId,
}: CreateTransactionInput) {
  const transaction = await runTransaction(db, async (tx) => {
    const qrRef = doc(qrTransactionsCollection(), qrTransactionId);
    const userRef = doc(usersCollection(), userId);

    const qrSnap = await tx.get(qrRef);

    if (!qrSnap.exists())
      throw new AppError("QR_CODE_NOT_FOUND", "QR Code nao encontrado", 404);

    const qrTransaction = qrSnap.data() as TransactionRead;

    if (qrTransaction.usedAt)
      throw new AppError("USED_QR_CODE", "Esse QR Code ja foi utilizado", 403);

    const now = Timestamp.now();

    if (now.toMillis() > qrTransaction.expiresAt.toMillis())
      throw new AppError("EXPIRED_QR_CODE", "Esse QR Code expirou", 400);

    const userSnap = await tx.get(userRef);

    if (!userSnap.exists())
      throw new AppError("USER_NOT_FOUND", "Usuario nao encontrado", 404);

    const user = userSnap.data() as UserRead;

    const earnedPoints = calculatePoints(qrTransaction.amount, user.level);

    tx.update(userRef, {
      points: increment(earnedPoints),
      totalPointsEarned: increment(earnedPoints),
      updatedAt: now,
    });

    tx.update(qrRef, { usedAt: now, updatedAt: now });

    const transactionRef = doc(transactionsCollection());

    const userTransaction = {
      userId,
      ...qrTransaction,
      id: transactionRef.id,
      createdAt: now,
      updatedAt: now,
      expiresAt: qrTransaction.expiresAt,
      qrTransactionId: qrSnap.id,
      usedAt: now,
      version: 1,
    };

    tx.set(transactionRef, userTransaction);

    return userTransaction;
  });

  return { id: transaction.id, transaction };
}

export async function getTransactionsRepository({
  filters,
  limit: pageSize,
  cursor,
}: GetTransactionsInput) {
  const constraints: QueryConstraint[] = [];

  if (filters?.userId) {
    constraints.push(where("userId", "==", filters.userId));
  }

  if (filters?.createdById) {
    constraints.push(where("createdById", "==", filters.createdById));
  }

  if (filters?.employeeId) {
    constraints.push(where("employeeId", "==", filters.employeeId));
  }

  if (filters?.establishmentId) {
    constraints.push(where("establishmentId", "==", filters.establishmentId));
  }

  if (filters?.campaignId) {
    constraints.push(where("campaignId", "==", filters.campaignId));
  }

  if (filters?.rewardId) {
    constraints.push(where("rewardId", "==", filters.rewardId));
  }

  if (filters?.type) {
    constraints.push(where("type", "==", filters.type));
  }

  if (filters?.source) {
    constraints.push(where("source", "==", filters.source));
  }

  if (filters?.status) {
    constraints.push(where("status", "==", filters.status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize + 1));

  const q = query(transactionsCollection(), ...constraints);

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

// Se quiser, posso apontar exatamente onde corrigir cada função e sugerir um fluxo mais seguro para Firebase.
// O QR reader usa JSON.parse(decodedText) direto do QR; poderia validar o payload com esquema.
// O fluxo de geração de QR permite qualquer usuário com role até admin criar códigos. Falta controle forte de quem pode gerar e consumir.
