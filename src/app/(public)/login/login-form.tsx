"use client";

import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { LoginSchema, loginSchema } from "./schema";

import { LaminatedButton } from "@/components/ui/laminated";
import Link from "next/link";
import { handlerError } from "@/utils/handler-error";
import { loginUser } from "@/features/auth/repositories/auth.repository";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handlePasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginUser(data.email, data.password);
      toast.success("Bem-vindo!", { id: "welcome" });
      router.replace("/dashboard");
    } catch (error) {
      handlerError(error);
      return;
    }
  };

  return (
    <>
      <form className="flex flex-col gap-2 w-full max-w-75">
        <div>
          <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
            <label htmlFor="email" className="sr-only">
              E-mail
            </label>
            <Mail size={20} className="text-slate-500" aria-hidden="true" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full text-slate-700 placeholder:text-slate-500 font-ubuntu outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
              autoComplete="email"
              required
              {...register("email")}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs font-ubuntu">
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <Lock size={20} className="text-slate-500" />
            <input
              type={isVisible ? "text" : "password"}
              placeholder="Sua senha"
              className="w-full text-slate-700 placeholder:text-slate-500 font-ubuntu outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
              autoComplete="current-password"
              required
              {...register("password")}
            />
            <button
              type="button"
              className="hover:cursor-pointer outline-none focus-within:outline-none focus-within:ring-0"
              onClick={handlePasswordVisible}
            >
              {isVisible ? (
                <Eye size={20} className="text-slate-500" />
              ) : (
                <EyeClosed size={20} className="text-slate-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs font-ubuntu">
              {errors.password.message}
            </span>
          )}
        </div>
        <Link
          href="/"
          className="text-violet-900 text-right text-xs font-normal font-ubuntu"
        >
          Esqueceu sua senha?
        </Link>
        <LaminatedButton
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando" : "Entrar"}
        </LaminatedButton>
      </form>
    </>
  );
};
