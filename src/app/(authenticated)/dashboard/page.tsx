"use client";

import { ChevronRight, Clover, Gift } from "lucide-react";
import { LEVELS, LINKS, PARTNERS, REWARDS } from "@/data";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import {
  NumberTicker,
  Progress,
  Skeleton,
  TypingAnimation,
} from "@/components/ui";
import { TransactionRead, UserRead } from "@/@types";
import { useEffect, useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import { LaminatedButton } from "@/components/ui/laminated";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getTransactionsController } from "@/features/transactions/controllers/transaction.controller";
import { getUserByIdController } from "@/features/users/controllers/user.controller";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/auth-context";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRead | undefined>(undefined);

  const [transactions, setTransactions] = useState<TransactionRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<DocumentSnapshot | null>(null);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!user) return;

      try {
        const profileFound = (await getUserByIdController(user.uid)) as
          UserRead | undefined;

        setProfile(profileFound);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const result = await getTransactionsController({
        limit: 5,
        cursor: nextCursor ?? undefined,
      });

      setTransactions((prev) => [...prev, ...result.transactions]);
      setNextCursor(result.cursor);
      setHasMore(!!result.cursor);
    } finally {
      setLoading(false);
    }
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadTransactions();
  }, []);

  const calculateProgress = (userPoints: number) => {
    const currentIndex = LEVELS.findLastIndex(
      (level) => userPoints >= level.points,
    );

    const currentLevel = LEVELS[currentIndex];
    const nextLevel = LEVELS[currentIndex + 1];

    if (!nextLevel) {
      return {
        progressPercentage: 100,
        currentLevel,
        nextLevel: currentLevel,
      };
    }

    const totalPoints = nextLevel.points - currentLevel.points;
    const earnedPoints = userPoints - currentLevel.points;
    const pointsToNextLevel = nextLevel.points - userPoints;

    return {
      progressPercentage: (earnedPoints / totalPoints) * 100,
      currentLevel,
      nextLevel,
      totalPoints,
      earnedPoints,
      pointsToNextLevel,
    };
  };

  const calculateElapsedTime = (transaction: TransactionRead) => {
    const createdAt = transaction.createdAt.toDate();

    return formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const progress = calculateProgress(profile?.points || 0);

  return (
    <div className="flex flex-col items-center justify-start flex-1 min-w-0 gap-4 p-4">
      {isLoading ? (
        <Skeleton className="bg-linear-to-tr from-blue-900 to-violet-600 w-full h-40 rounded-tl-4xl rounded-br-lg p-4 animate-pulse" />
      ) : (
        <section className="bg-linear-to-tr from-blue-900 to-violet-600 w-full h-40 rounded-tl-4xl rounded-br-lg p-4">
          <div className="flex flex-col lg:max-w-2/3">
            <TypingAnimation
              key={profile?.name}
              className="text-slate-100 text-lg font-ubuntu font-bold"
              words={[`Ola, ${profile?.name}! 👋`]}
              typeSpeed={50}
            />
            <p className="text-slate-100 text-sm font-ubuntu font-bold">
              <NumberTicker
                className="text-3xl text-yellow-400"
                value={progress?.earnedPoints || 0}
              />{" "}
              pontos
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:max-w-2/3">
            <div className="flex flex-row justify-between items-center">
              <span className="font-ubuntu text-sm text-slate-100">
                Progresso
              </span>
              <span className="font-ubuntu text-sm text-slate-100">
                {progress?.progressPercentage.toFixed(2)}%
              </span>
            </div>
            <Progress value={progress?.progressPercentage} />
            <span className="text-xs text-slate-100 text-right font-ubuntu font-medium">
              {progress?.pointsToNextLevel || 0} pts para{" "}
              {progress?.nextLevel?.level}
            </span>
          </div>
        </section>
      )}
      {isLoading ? (
        <Skeleton className="bg-linear-to-tr from-slate-300 to-slate-200 w-full h-32 rounded animate-pulse" />
      ) : (
        <ul className="grid grid-cols-4 w-full md:grid-cols-5">
          {LINKS.filter((link) => link.roles.includes(profile!.role)).map(
            (link) => (
              <Link key={link.id} href={link.url}>
                <li className="flex flex-col items-center gap-1 rounded-md p-1">
                  <Image
                    src={link.image}
                    alt="Icone de escanear"
                    width={48}
                    height={48}
                  />
                  <p className="text-violet-900 text-xs text-center font-bold font-ubuntu">
                    {link.text}
                  </p>
                </li>
              </Link>
            ),
          )}
        </ul>
      )}
      <article className="bg-zinc-200/50 flex flex-col gap-4 w-full rounded-xl p-2">
        <section className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h3 className="text-violet-950/80 text-base font-ubuntu font-medium">
              Ultimas atividades
            </h3>
            <Link href="/history" className="">
              <ChevronRight
                size={16}
                className="text-slate-500"
                strokeWidth={3}
              />
            </Link>
          </div>
          {transactions.map((tr) => (
            <div
              key={tr.id}
              className="bg-slate-100 flex flex-row justify-between items-center gap-3 rounded-xl p-2"
            >
              {tr.type === "earn" ? (
                <div className="bg-linear-to-tr from-yellow-600 to-yellow-500 rounded-xl p-2">
                  <Clover size={20} className="text-yellow-200" />
                </div>
              ) : (
                <div className="bg-linear-to-tr from-violet-600 to-violet-500 rounded-xl p-2">
                  <Gift size={20} className="text-violet-200" />
                </div>
              )}
              <div className="flex flex-row justify-between items-center flex-1">
                <span className="text-slate-800 text-sm font-ubuntu font-medium">
                  {`${tr.type === "earn" ? "+" : "-"} ${Math.trunc(tr.amount)} pontos`}
                </span>
                <span className="text-slate-500 text-xs font-ubuntu">
                  {calculateElapsedTime(tr)}
                </span>
              </div>
            </div>
          ))}
          {hasMore && (
            <LaminatedButton onClick={loadTransactions} disabled={loading}>
              {loading ? "Carregando..." : "Carregar mais"}
            </LaminatedButton>
          )}
        </section>
        <section>
          <h3 className="text-violet-950/80 text-base font-ubuntu font-medium">
            Recompensas em destaque
          </h3>
          <ul className="flex flex-row overflow-x-scroll">
            {REWARDS.map((reward) => (
              <li key={reward.id} className="p-2">
                <Image
                  src={reward.image}
                  alt={reward.name}
                  width={100}
                  height={100}
                  className="min-w-48"
                  loading="eager"
                />
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4 py-4">
          <h3 className="text-violet-950/80 text-base font-ubuntu font-medium">
            Lojas parceiras
          </h3>
          <Marquee>
            <MarqueeFade className="from-slate-200 w-5" side="left" />
            <MarqueeFade className="from-slate-200 w-5" side="right" />
            <MarqueeContent>
              {PARTNERS.map((partner) => (
                <MarqueeItem key={partner.id} className="mx-4">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    className="rounded-full"
                    width={100}
                    height={100}
                  />
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        </section>
      </article>
    </div>
  );
}
