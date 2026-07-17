"use client";

import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function Register() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 h-screen p-4 md:px-8">
        <Link
          href="/"
          className="flex flex-row justify-center items-center gap-2"
        >
          <Image
            src="/images/logo.png"
            className="rounded-full"
            width="36"
            height="36"
            alt="trevo pass logo"
            priority
          />
          <p className="inline-flex gap-1 text-xl font-bold font-ubuntu">
            <span className="text-violet-900">Trevo</span>
            <span className="text-yellow-500">Pass</span>
          </p>
        </Link>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-slate-900 text-lg font-medium font-ubuntu">
            Crie a sua conta
          </h2>
          <p className="text-slate-500 text-sm text-center font-normal font-ubuntu">
            Comece a ganhar pontos e resgatar recompensas
          </p>
        </div>
        <RegisterForm />
        <div className="flex flex-col gap-3 w-full max-w-75">
          <div className="flex flex-row items-center gap-2">
            <span className="border-t border-slate-300 flex-1"></span>
            <span className="text-slate-500 text-sm font-normal font-ubuntu">
              Ja possui uma conta?
            </span>
            <span className="border-b border-slate-300 flex-1"></span>
          </div>
          <Link href="/login" className="text-center">
            <span className="text-violet-900 text-base underline font-bold font-ubuntu">
              Entrar
            </span>
          </Link>
          <span className="text-slate-500 text-center text-xs">
            Ao continuar, voce concorda com os{" "}
            <Link
              href="/"
              className="text-violet-900 font-bold font-ubuntu underline cursor-pointer"
            >
              Termos de Servico
            </Link>{" "}
            e a{" "}
            <Link
              href="/"
              className="text-violet-900 font-bold font-ubuntu underline cursor-pointer"
            >
              Politica de Privacidade
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
