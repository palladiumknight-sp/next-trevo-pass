import {
  createQrTransactionService,
  getQrTransactionsService,
  updateQrTransactionService,
} from "../services/qr-transaction.service";

import { TransactionUpdate } from "@/@types";
import { handlerError } from "@/utils/handler-error";

export async function createQrTransactionController(data: any) {
  try {
    const qrTransaction = await createQrTransactionService(data);

    return qrTransaction;
  } catch (error: unknown) {
    console.log("MANO, TA DANDO ALGUM ERRO PRA LER O QR CODE")
    handlerError(error);
  }
}

export async function getQrTransactionsController() {
  try {
    const qrTransactions = await getQrTransactionsService()
    
    return qrTransactions;
  } catch (error: unknown) {
    handlerError(error)
  }
}

export async function updateQrTransactionController(
  transactionId: string,
  data: TransactionUpdate,
) {
  try {
    const qrTransaction = await updateQrTransactionService(transactionId, data);

    return qrTransaction;
  } catch (error: unknown) {
    handlerError(error);
  }
}
