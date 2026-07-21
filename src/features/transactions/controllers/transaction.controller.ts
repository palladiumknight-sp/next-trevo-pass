import { CreateTransactionInput, GetTransactionsInput } from "@/@types";
import {
  createTransactionService,
  getTransactionsService,
} from "../services/transaction.service";

import { handlerError } from "@/utils/handler-error";

export async function createTransactionController(
  data: CreateTransactionInput,
) {
  try {
    const transaction = await createTransactionService(data);

    return transaction;
  } catch (error) {
    throw handlerError(error);
  }
}

export async function getTransactionsController(data: GetTransactionsInput) {
  try {
    return await getTransactionsService(data);
  } catch (error) {
    throw handlerError(error);
  }
}
