"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mail, Send, X } from "lucide-react";

import { LaminatedButton } from "@/components/ui/laminated";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface ForgotPasswordModalProps {
  initialEmail: string;
  onClose: () => void;
}

export function ForgotPasswordModal({
  initialEmail,
  onClose,
}: ForgotPasswordModalProps) {
  const { sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSending) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSending, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) return;

    try {
      setIsSending(true);
      await sendPasswordResetEmail(normalizedEmail);
      setHasSubmitted(true);
      toast.success(
        "Se houver uma conta com esse e-mail, enviaremos um link de recuperação.",
      );
    } catch {
      // Keep the response generic so this flow does not disclose whether an email is registered.
      setHasSubmitted(true);
      toast.success(
        "Se houver uma conta com esse e-mail, enviaremos um link de recuperação.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-violet-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSending) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_20px_60px_rgba(46,16,101,0.30)] sm:p-7"
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="forgot-password-title"
              className="text-xl font-bold text-violet-950 sm:text-2xl"
            >
              Recuperar senha
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Informe o e-mail associado à sua conta.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar janela"
            onClick={onClose}
            disabled={isSending}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {hasSubmitted ? (
          <div className="flex flex-col gap-4">
            <p
              role="status"
              className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 text-sm leading-6 text-slate-700"
            >
              Se houver uma conta associada a esse e-mail, enviaremos um link
              para redefinir sua senha.
            </p>
            <LaminatedButton type="button" onClick={onClose} className="w-full">
              Voltar ao login
            </LaminatedButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label
              htmlFor="forgot-password-email"
              className="flex flex-col gap-1.5 text-sm font-semibold text-violet-950"
            >
              E-mail
              <span className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/40 px-3 py-2.5 text-slate-600 focus-within:ring-2 focus-within:ring-violet-100">
                <Mail size={17} aria-hidden="true" />
                <input
                  ref={emailInputRef}
                  id="forgot-password-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                  className="min-w-0 flex-1 bg-transparent font-normal text-slate-800 outline-none"
                />
              </span>
            </label>

            <p className="rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-sm leading-6 text-slate-600">
              Enviaremos instruções para redefinir sua senha se encontrarmos uma
              conta associada a esse endereço.
            </p>

            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
              >
                Cancelar
              </button>
              <LaminatedButton
                type="submit"
                disabled={isSending || !email.trim()}
                className="inline-flex items-center justify-center gap-2"
              >
                <Send size={17} aria-hidden="true" />
                {isSending ? "Enviando..." : "Enviar link"}
              </LaminatedButton>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
