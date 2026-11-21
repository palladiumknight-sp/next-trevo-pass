import { CreateTransactionInput, GetTransactionsInput } from "@/@types";
import {
  createTransactionRepository,
  getTransactionsRepository,
} from "../repositories/transaction.repository";

import { AppError } from "@/utils/app-error";

export async function createTransactionService(data: CreateTransactionInput) {
  const { qrTransactionId, userId } = data;

  if (!qrTransactionId) {
    throw new AppError("INVALID_QR", "QR inválido", 400);
  }

  if (!userId) {
    throw new AppError("INVALID_USER", "Usuário inválido", 400);
  }

  const transactionResult = await createTransactionRepository({
    qrTransactionId,
    userId,
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
    filters: { ...filters, userId: filters?.userId },
    limit,
    cursor,
  });

  return transactions;
}
