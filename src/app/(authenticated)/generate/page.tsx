"use client";

import {
  CreateQrTransactionInput,
  EventType,
  QrCode,
  TransactionForm,
} from "@/@types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { LaminatedButton } from "@/components/ui/laminated";
import { QRCode } from "@/components/kibo-ui/qr-code";
import { createQrTransactionController } from "@/features/transactions/controllers/qr-transaction.controller";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export default function Generate() {
  const { user } = useAuth();

  const [code, setCode] = useState<QrCode | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [transaction, setTransaction] = useState<TransactionForm>({
    event: "purchase",
    referenceId: "",
    amount: 0,
  });

  // Function that captures data for creating a purchase, redemption or campaign participation event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setTransaction((prev) => ({
      ...prev,
      [id]: id === "amount" ? Number(value) : value,
    }));
  };

  // Function that generates the QR Code so that the customer/consumer can redeem the purchase points with their device
  const generateCode = async () => {
    try {
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const payloadQr: CreateQrTransactionInput = {
        event: transaction.event,
        referenceId: transaction.referenceId,
        amount: transaction.amount,
        user,
      };

      const result = await createQrTransactionController(payloadQr);

      if (!result) {
        toast.error("Nao foi possivel gerar o QR Code", {
          id: "qr-code-not-created",
        });
        return;
      }

      const { id, expiresAt, version } = result;

      const expirationDate = expiresAt.toDate();

      const payload = JSON.stringify({
        id,
        version,
        expiresAt: expirationDate,
      });

      setCode({
        id,
        version,
        expiresAt: expirationDate,
        payload,
      });

      console.log(code, payload);
    } catch (error: unknown) {
      console.error("Erro ao gerar QR Code: ", error);
    }
  };

  // Variavel with the function of checking whether a QR Code is expired or not
  const isExpired = code ? currentTime > code.expiresAt.getTime() : true;

  // Variavel with the function of counting down the seconds for the QR Code to expire
  const remainingSeconds = code
    ? Math.max(0, Math.floor((code.expiresAt.getTime() - currentTime) / 1000))
    : 0;

  // Effect that keeps the QR Code countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Effect that generates a new QR Code when time is up
  // useEffect(() => {
  //   if (!code) return;

  //   if(isExpired) {
  //     generateCode()
  //   }

  // }, [isExpired])

  const EVENTS = [
    { id: 1, text: "Compra", value: "purchase" },
    { id: 2, text: "Resgate", value: "reward" },
    { id: 3, text: "Campanha", value: "campaign" },
  ];

  return (
    <div className="flex flex-col flex-1">
      {!code || isExpired ? (
        <form
          className="flex flex-col justify-center gap-4 p-4 flex-1 max-w-150 mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="">
            <h2 className="text-center text-xl font-bold text-violet-900 font-ubuntu">
              Gerar QR Code
            </h2>
            <p className="text-center text-sm font-medium text-violet-700 font-ubuntu">
              Registre um evento e gere o QR Code para o cliente
            </p>
          </div>
          <Select
            value={transaction.event}
            onValueChange={(value) =>
              setTransaction((prev) => ({ ...prev, event: value as EventType }))
            }
          >
            <SelectTrigger
              className="font-ubuntu px-4 py-5 border-2 border-yellow-500 w-full"
              data-size="default"
            >
              <SelectValue
                className="font-ubuntu"
                placeholder="Selecione o evento"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {EVENTS.map((event) => (
                  <SelectItem
                    key={event.id}
                    value={event.value}
                    className="px-4 py-3 font-ubuntu"
                  >
                    {event.text}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input
            id="referenceId"
            name="referenceId"
            placeholder="Digite aqui o codigo do produto"
            className="font-ubuntu"
            value={transaction.referenceId}
            onChange={handleChange}
          />
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="Digite aqui o valor da compra"
            className="font-ubuntu"
            value={transaction.amount}
            onChange={handleChange}
          />
          <LaminatedButton type="button" onClick={generateCode}>
            Gerar codigo
          </LaminatedButton>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 flex-1 font-ubuntu">
          <h2 className="text-xl font-bold text-slate-900">
            Hora de resgatar seus pontos
          </h2>
          <p className="text-base font-medium text-slate-700">
            Posicione sua camera no QR Code
          </p>
          <QRCode
            data={code.payload}
            className="rounded-md bg-slate-100 size-48 p-4 shadow-sm"
          />
          <p className="text-base text-red-500 font-bold font-sans">
            Expira em {remainingSeconds}s
          </p>
        </div>
      )}
    </div>
  );
}
