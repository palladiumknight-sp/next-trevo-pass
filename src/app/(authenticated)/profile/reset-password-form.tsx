"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";

import { LaminatedButton } from "@/components/ui/laminated";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface ResetPasswordFormProps {
  user: User | null;
  setActiveModal: (modal: "data" | "security" | null) => void;
}

export function ResetPasswordForm({
  user,
  setActiveModal,
}: ResetPasswordFormProps) {
  const { sendPasswordResetEmail } = useAuth();
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.email) {
      toast.error("Não foi possível encontrar o e-mail desta conta.");
      return;
    }

    try {
      setIsSendingResetEmail(true);
      await sendPasswordResetEmail(user.email);
      toast.success("Enviamos um link para redefinir sua senha.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o e-mail de recuperação.",
      );
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  return (
    <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-violet-950">
        E-mail da conta
        <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-600">
          <Mail size={17} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">{user?.email || "—"}</span>
        </span>
      </label>

      <p className="rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-sm leading-6 text-slate-600">
        Enviaremos um link seguro para esse endereço. Use-o para criar uma nova
        senha e proteger sua conta.
      </p>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          disabled={isSendingResetEmail}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <LaminatedButton
          type="submit"
          disabled={isSendingResetEmail || !user?.email}
        >
          <Send size={17} aria-hidden="true" />
          {isSendingResetEmail
            ? "Enviando link..."
            : "Enviar link de recuperação"}
        </LaminatedButton>
      </div>
    </form>
  );
}
