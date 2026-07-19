"use client";

import { useEffect, useRef } from "react";

import { Html5QrcodeScanner } from "html5-qrcode";
import { createTransactionController } from "@/features/transactions/controllers/transaction.controller";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function Reader() {
  const { user } = useAuth();
  const router = useRouter();
  const loadingRef = useRef(false);
  const lastScannedRef = useRef<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false,
    );

    scanner.render(
      async (decodedText) => {
        if (!decodedText || loadingRef.current) return;

        if (lastScannedRef.current === decodedText) return;

        lastScannedRef.current = decodedText;

        if (!user) {
          toast.error("Usuario nao autenticado");
          return;
        }

        loadingRef.current = true;

        const loadingToastId = "qr-loading";
        toast.loading("Processando QR Code", { id: loadingToastId });

        try {
          const data = JSON.parse(decodedText);

          if (typeof data !== "object" || data === null || !("id" in data)) {
            throw new Error("QR Code inválido");
          }

          await createTransactionController({
            transactionId: data.id,
            customerId: user.uid,
          });

          await scanner.clear().catch(() => {});

          toast.success("Novos pontos adicionados ao seu passe!", {
            id: loadingToastId,
          });

          router.replace("/dashboard");
        } catch (error: unknown) {
          console.error(error);

          const message =
            error instanceof Error ? error.message : "Erro inesperado.";

          toast.error(message, {
            id: loadingToastId,
          });
        } finally {
          loadingRef.current = false;
        }
      },
      (error: unknown) => {
        console.warn("QR scan error: ", error);
      },
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [router, user]);

  return <div id="reader"></div>;
}
