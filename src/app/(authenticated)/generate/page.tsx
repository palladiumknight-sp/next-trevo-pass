"use client";

import { useEffect, useState } from "react";

import { LaminatedButton } from "@/components/ui/laminated";
import { QRCode } from "@/components/kibo-ui/qr-code";
import { User } from "firebase/auth";
import { createQrTransactionController } from "@/features/transactions/controllers/qr-transaction.controller";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export interface QrCode {
  id: string;
  expiresAt: Date;
  version: number;
  payload: string;
}

export interface TransactionForm {
  event: string;
  referenceId: string;
  amount: number;
  user: User | null;
}

export default function Generate() {
  const { user } = useAuth();

  const [code, setCode] = useState<QrCode | null>(null);
  const [now, setNow] = useState(Date.now());
  const [transaction, setTransaction] = useState<TransactionForm>({
    event: "",
    referenceId: "",
    amount: 0,
    user: user,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setTransaction((prev) => ({
      ...prev,
      [id]: id === "amount" ? Number(value) : value,
    }));
  };

  const generateCode = async () => {
    try {
      const result = await createQrTransactionController(transaction);

      if (!result) {
        toast.error("Nao foi possivel gerar o QR Code", {
          id: "qr-code-not-created",
        });
        return;
      }

      const { id, expiresAt, version } = result;

      const payload = JSON.stringify({
        id,
        version,
        expiresAt: expiresAt.toDate(),
      });

      setCode({
        id,
        expiresAt: expiresAt.toDate(),
        version,
        payload,
      });
    } catch (error: unknown) {
      console.error("Erro ao gerar QR Code: ", error);
    }
  };

  const isExpired = code ? now > code.expiresAt.getTime() : true;
  const remainingSeconds = code
    ? Math.max(0, Math.floor((code.expiresAt.getTime() - now) / 1000))
    : 0;

  useEffect(() => {
    if (user) {
      setTransaction((prev) => ({
        ...prev,
        user,
      }));
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (!code) return;

  //   if(isExpired) {
  //     generateCode()
  //   }

  // }, [isExpired])

  return (
    <div>
      {!code || isExpired ? (
        <form>
          <input
            id="event"
            name="event"
            placeholder="Digite aqui o evento"
            value={transaction.event}
            onChange={handleChange}
          />
          <input
            id="referenceId"
            name="referenceId"
            placeholder="Digite aqui o codigo do produto"
            value={transaction.referenceId}
            onChange={handleChange}
          />
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="Digite aqui o valor da compra"
            value={transaction.amount}
            onChange={handleChange}
          />
          <LaminatedButton type="button" onClick={generateCode}>
            Gerar codigo
          </LaminatedButton>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 flex-1 font-ubuntu">
          <h2 className="text-xl font-bold text-slate-800">Hora de resgatar seus pontos</h2>
          <p className="text-base font-medium text-slate-600">Posicione sua camera no QR Code</p>
          <QRCode data={code.payload} className="rounded-md bg-slate-100 size-48 p-4 shadow-sm" />
          <p className="text-base text-red-500 font-bold font-sans">
            Expira em {remainingSeconds}s
          </p>
        </div>
      )}
    </div>
  );
}
