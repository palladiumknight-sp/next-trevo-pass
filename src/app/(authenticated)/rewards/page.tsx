"use client";

import Image from "next/image";
import { Gift, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { LaminatedButton } from "@/components/ui/laminated";
import { REWARDS } from "@/data";
import { Skeleton } from "@/components/ui";
import { UserRead } from "@/@types";
import { getUserByIdController } from "@/features/users/controllers/user.controller";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export default function Rewards() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const profileFound = await getUserByIdController(user.uid);
        setProfile(profileFound as UserRead);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleRewardSelection = (rewardName: string) => {
    toast.info(`${rewardName} selecionada`, {
      description: "O fluxo de resgate será conectado em breve.",
    });
  };

  const points = profile?.points ?? 0;

  return (
    <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <section className="flex flex-col gap-1 rounded-br-xl rounded-tl-4xl bg-linear-to-tr from-violet-950 to-violet-700 p-5 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-yellow-400" />
          <h1 className="font-ubuntu text-xl font-bold">Recompensas</h1>
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-40 bg-white/20" />
        ) : (
          <>
            <span className="font-ubuntu text-sm text-violet-100">
              Seu saldo disponível
            </span>
            <strong className="font-ubuntu text-3xl text-yellow-400">
              {points} pontos
            </strong>
          </>
        )}
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {REWARDS.map((reward) => (
            <Skeleton key={reward.id} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <section
          aria-label="Lista de recompensas"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {REWARDS.map((reward) => {
            const available = points >= reward.points;

            return (
              <article
                key={reward.id}
                className="flex min-h-72 flex-col overflow-hidden rounded-xl border border-violet-100 bg-slate-100 shadow-sm"
              >
                <div className="relative flex h-44 items-center justify-center bg-white p-4">
                  <Image
                    src={reward.image}
                    alt={reward.name}
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                  {!available && (
                    <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white">
                      Faltam {reward.points - points} pts
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-ubuntu text-base font-bold text-violet-950">
                      {reward.name}
                    </h2>
                    <Gift className="size-5 shrink-0 text-yellow-600" />
                  </div>

                  <p className="font-ubuntu text-sm font-medium text-slate-600">
                    {reward.points} pontos
                  </p>

                  <LaminatedButton
                    type="button"
                    color={available ? "yellow" : "slate"}
                    size="sm"
                    className="mt-auto w-full"
                    disabled={!available}
                    onClick={() => handleRewardSelection(reward.name)}
                  >
                    {available ? "Resgatar" : "Pontos insuficientes"}
                  </LaminatedButton>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
