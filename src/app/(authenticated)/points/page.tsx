"use client";

import { Clover, Gift, LoaderCircle } from "lucide-react";
import { Progress, Skeleton } from "@/components/ui";
import { TransactionRead, UserRead } from "@/@types";
import { useCallback, useEffect, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { LEVELS } from "@/data";
import { LaminatedButton } from "@/components/ui/laminated";
import { calculateElapsedTime } from "@/utils/calculate-elapsed-time";
import { getTransactionsController } from "@/features/transactions/controllers/transaction.controller";
import { getUserByIdController } from "@/features/users/controllers/user.controller";
import { useAuth } from "@/contexts/auth-context";

const SOURCE_LABELS = {
  purchase: "Compra",
  reward: "Resgate",
  campaign: "Campanha",
} as const;

export default function Points() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRead | null>(null);
  const [transactions, setTransactions] = useState<TransactionRead[]>([]);
  const [nextCursor, setNextCursor] = useState<DocumentSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await getUserByIdController(user.uid);
        if (!cancelled) setProfile(userProfile as UserRead);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const profileId = profile?.id;
    if (!profileId) return;

    let cancelled = false;

    async function loadInitialTransactions() {
      try {
        setIsLoadingTransactions(true);

        const result = await getTransactionsController({
          filters: { userId: profileId },
          limit: 10,
        });

        if (cancelled) return;

        setTransactions(result.transactions);
        setNextCursor(result.cursor);
        setHasMore(Boolean(result.cursor));
      } finally {
        if (!cancelled) setIsLoadingTransactions(false);
      }
    }

    loadInitialTransactions();

    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const loadMoreTransactions = useCallback(async () => {
    if (!profile?.id || isLoadingTransactions || !hasMore) return;

    try {
      setIsLoadingTransactions(true);

      const result = await getTransactionsController({
        filters: { userId: profile.id },
        limit: 10,
        cursor: nextCursor ?? undefined,
      });

      setTransactions((previous) => {
        const transactionsById = new Map(
          previous.map((transaction) => [transaction.id, transaction]),
        );

        result.transactions.forEach((transaction) => {
          transactionsById.set(transaction.id, transaction);
        });

        return [...transactionsById.values()];
      });
      setNextCursor(result.cursor);
      setHasMore(Boolean(result.cursor));
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [hasMore, isLoadingTransactions, nextCursor, profile?.id]);

  const points = profile?.points ?? 0;
  const currentLevelIndex = LEVELS.findLastIndex(
    (level) => points >= level.points,
  );
  const currentLevel = LEVELS[currentLevelIndex] ?? LEVELS[0];
  const nextLevel = LEVELS[currentLevelIndex + 1];

  const progress = nextLevel
    ? ((points - currentLevel.points) /
        (nextLevel.points - currentLevel.points)) *
      100
    : 100;

  const pointsToNextLevel = nextLevel
    ? Math.max(0, nextLevel.points - points)
    : 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      {isLoading ? (
        <Skeleton className="h-44 w-full rounded-3xl" />
      ) : (
        <section className="rounded-tl-4xl rounded-br-lg bg-linear-to-tr from-blue-900 to-violet-600 p-5 text-white shadow-sm">
          <p className="text-sm font-medium text-white/75">Saldo disponível</p>
          <p className="mt-1 text-4xl font-bold text-yellow-400">
            {points.toLocaleString("pt-BR")}
            <span className="ml-2 text-base text-white">pontos</span>
          </p>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Nível {currentLevel.level}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
            <p className="mt-2 text-right text-xs text-white/80">
              {nextLevel
                ? `${pointsToNextLevel} pontos para ${nextLevel.level}`
                : "Maior nível alcançado"}
            </p>
          </div>
        </section>
      )}
      <section className="flex flex-col gap-3 rounded-xl bg-zinc-200/50 p-3">
        <div>
          <h1 className="text-lg font-bold text-violet-950">Meus pontos</h1>
          <p className="text-sm text-slate-500">
            Histórico de ganhos e resgates
          </p>
        </div>
        {isLoading || isLoadingTransactions ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-xl bg-slate-100 p-6 text-center">
            <p className="font-medium text-slate-700">
              Nenhuma movimentação encontrada.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((transaction) => {
              const isEarn = transaction.type === "earn";
              const date = transaction.createdAt.toDate();

              return (
                <article
                  key={transaction.id}
                  className="bg-slate-100 flex flex-row justify-between items-center gap-3 rounded-xl p-3"
                >
                  <div
                    className={`rounded-xl p-2 ${
                      isEarn
                        ? "bg-linear-to-tr from-yellow-600 to-yellow-500"
                        : "bg-linear-to-tr from-violet-600 to-violet-500"
                    }`}
                  >
                    {isEarn ? (
                      <Clover size={20} className="text-yellow-100" />
                    ) : (
                      <Gift size={20} className="text-violet-100" />
                    )}
                  </div>
                  <div className="flex flex-row justify-between items-center flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {transaction.establishmentId}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {SOURCE_LABELS[transaction.source] ??
                          transaction.source}{" "}
                        {calculateElapsedTime(date)}
                      </p>
                    </div>
                    <span className="text-yellow-600 text-md font-bold">
                      {`${isEarn ? "+" : "-"}${Math.trunc(transaction.amount)} pontos`}
                    </span>
                  </div>
                </article>
              );
            })}
            {hasMore && (
              <LaminatedButton
                type="button"
                onClick={loadMoreTransactions}
                disabled={isLoadingTransactions}
                className="mt-1 w-full"
              >
                {isLoadingTransactions ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} />
                    Carregando...
                  </span>
                ) : (
                  "Carregar mais"
                )}
              </LaminatedButton>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
