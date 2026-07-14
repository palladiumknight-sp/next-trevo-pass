"use client";

import { Eye, EyeClosed, IdCard, Lock, Mail, Phone, User } from "lucide-react";
import { RegisterSchema, registerSchema } from "./schema";

import { Input } from "@/components/ui/input";
import { LaminatedButton } from "@/components/ui/laminated";
import Link from "next/link";
import { UserBase } from "@/@types";
import { checkDuplicate } from "@/utils/check-duplicate";
import { createAuthController } from "@/features/auth/controllers/auth.controller";
import { createUserController } from "@/features/users/controllers/user.controller";
import { handlerError } from "@/utils/handler-error";
import { normalizeCpf } from "@/utils/normalize-cpf";
import { normalizePhone } from "@/utils/normalize-phone";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handlePasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const { email, password, phone, cpf } = data;

      const normalizedPhone = normalizePhone(phone);
      const normalizedCpf = normalizeCpf(cpf);

      await checkDuplicate(normalizedPhone, normalizedCpf);

      const { uid } = await createAuthController(email, password);

      const newUser: UserBase = {
        id: uid,
        ...data
      }

      await createUserController(newUser);

      toast.success("Conta criada com sucesso!", { id: "register-success" });
      router.push("/dashboard");
    } catch (error: unknown) {
      handlerError(error);
      return;
    }
  };

  return (
    <>
      <form className="flex flex-col gap-2 w-full max-w-75">
        <Input
          label="Seu nome e sobrenome"
          icon={User}
          placeholder="Seu nome e sobrenome"
          type="text"
          {...register("name")}
          error={errors.name}
          required
        />
        <div>
          <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
            <label htmlFor="email" className="sr-only">
              E-mail
            </label>
            <Mail size={20} className="text-slate-500" aria-hidden="true" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full text-slate-700 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
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
            <label htmlFor="phone" className="sr-only">
              Telefone
            </label>
            <Phone size={20} className="text-slate-500" aria-hidden="true" />
            <input
              type="phone"
              placeholder="Informe seu telefone"
              className="w-full text-slate-700 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
              autoComplete="telefone"
              required
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <span className="text-red-500 text-xs font-ubuntu">
              {errors.phone.message}
            </span>
          )}
        </div>
        <div>
          <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
            <label htmlFor="cpf" className="sr-only">
              CPF
            </label>
            <IdCard size={20} className="text-slate-500" aria-hidden="true" />
            <input
              type="cpf"
              placeholder="Informe seu CPF"
              className="w-full text-slate-700 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
              autoComplete="cpf"
              required
              {...register("cpf")}
            />
          </div>
          {errors.cpf && (
            <span className="text-red-500 text-xs font-ubuntu">
              {errors.cpf.message}
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
              className="w-full text-slate-700 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
              autoComplete="new-password"
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
        <div>
          <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
            <label htmlFor="confirm-password" className="sr-only">
              Confirme sua senha
            </label>
            <Lock size={20} className="text-slate-500" />
            <input
              type={isVisible ? "text" : "password"}
              placeholder="Confirme sua senha"
              className="w-full text-slate-700 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
              autoComplete="new-password"
              required
              {...register("confirmPassword")}
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
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs font-ubuntu">
              {errors.confirmPassword.message}
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
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processando..." : "Criar conta"}
        </LaminatedButton>
      </form>
    </>
  );
};
