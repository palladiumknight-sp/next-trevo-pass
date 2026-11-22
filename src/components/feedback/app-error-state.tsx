import { AlertTriangle, Home, RefreshCw, SearchX } from "lucide-react";

import Link from "next/link";

interface AppErrorStateProps {
  kind: "not-found" | "unexpected";
  onRetry?: () => void;
}

const CONTENT = {
  "not-found": {
    code: "404",
    title: "Página não encontrada",
    description:
      "Não encontramos essa página. Ela pode ter sido removida ou o endereço pode estar incorreto.",
    Icon: SearchX,
  },
  unexpected: {
    code: "Ops",
    title: "Algo deu errado",
    description:
      "Ocorreu um erro inesperado. Tente novamente ou volte para o início.",
    Icon: AlertTriangle,
  },
} as const;

export function AppErrorState({ kind, onRetry }: AppErrorStateProps) {
  const { code, title, description, Icon } = CONTENT[kind];

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-4 py-12">
      <section
        role="alert"
        className="w-full max-w-lg rounded-3xl border border-violet-100 bg-white p-7 text-center shadow-[0_12px_30px_rgba(91,33,182,0.12)] sm:p-10"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <Icon size={34} aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-violet-700">
          {code}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-violet-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm leading-6 text-slate-600">
          {description}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-800 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 hover:cursor-pointer"
            >
              <RefreshCw size={18} aria-hidden="true" />
              Tentar novamente
            </button>
          }
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-800 px-5 py-3 font-semibold text-white transition hover:bg-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 hover:cursor-pointer"
          >
            <Home size={18} aria-hidden="true" />
            Ir para o início
          </Link>
        </div>
      </section>
    </main>
  );
}
