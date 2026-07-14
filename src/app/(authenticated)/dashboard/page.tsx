"use client";

import { ChevronRight, Clover, Gift, } from "lucide-react";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/kibo-ui/marquee";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { UserRead } from "@/@types";
import { getUserByIdController } from "@/features/users/controllers/user.controller";
import { useAuth } from "@/contexts/auth-context";

const REWARDS = [
  { id: 1, name: "20% de Desconto", points: 100, image: "/images/rewards/20-por-cento-off.png" },
  { id: 2, name: "500g de Acai Grátis", points: 200, image: "/images/rewards/500g-gratis.png" },
  { id: 3, name: "Copo Personalizado", points: 300, image: "/images/rewards/copo-personalizado.png" },
  { id: 4, name: "Vale Compras", points: 300, image: "/images/rewards/vale-compras.png" },
];

const LEVELS = [
  { level: "Bronze", points: 0 },
  { level: "Prata", points: 1000 },
  { level: "Ouro", points: 2000 },
  { level: "Platina", points: 3000 },
];

const PARTNERS = [
  {
    id: 1,
    name: "Smart Fit",
    category: "Academia",
    logo: "/images/partners/smartfit.png",
  },
  {
    id: 2,
    name: "Bodytech",
    category: "Academia",
    logo: "/images/partners/bodytech.png",
  },
  {
    id: 3,
    name: "CrossFit Porto Seguro",
    category: "CrossFit",
    logo: "/images/partners/cfps.png",
  },
  {
    id: 4,
    name: "Growth Supplements",
    category: "Suplementação",
    logo: "/images/partners/growth.png",
  },
  {
    id: 5,
    name: "Max Titanium",
    category: "Suplementação",
    logo: "/images/partners/max-titanium.png",
  },
  {
    id: 6,
    name: "Integralmedica",
    category: "Suplementação",
    logo: "/images/partners/integral-medica.png",
  },
  {
    id: 7,
    name: "Track&Field",
    category: "Moda Fitness",
    logo: "/images/partners/track-field.png",
  },
  {
    id: 8,
    name: "Live!",
    category: "Moda Fitness",
    logo: "/images/partners/live.png",
  },
  {
    id: 9,
    name: "Centauro",
    category: "Artigos Esportivos",
    logo: "/images/partners/centauro.png",
  },
  {
    id: 10,
    name: "Decathlon",
    category: "Artigos Esportivos",
    logo: "/images/partners/decathlon.png",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRead | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!user) return;

      try {
        const profileFound = await getUserByIdController(user.uid) as UserRead | undefined;
        setProfile(profileFound)
      } finally {
        setIsLoading(false)
      }
    };

    loadUser();
  }, [user]);


  const calculateProgress = (userPoints: number) => {
    const currentIndex = LEVELS.findLastIndex(
      level => userPoints >= level.points
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
      pointsToNextLevel
    };
  };

  const progress = calculateProgress(profile?.points || 0);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-4">
      {
        isLoading ? (
          <Skeleton className="bg-linear-to-tr from-blue-900 to-violet-600 w-full h-40 rounded-tl-4xl rounded-br-lg p-4 animate-pulse" />
        ) : (
          <section className="bg-linear-to-tr from-blue-900 to-violet-600 w-full h-40 rounded-tl-4xl rounded-br-lg p-4">
            <TypingAnimation key={profile?.name} className="text-slate-100 text-lg font-ubuntu font-bold" words={[`Ola, ${profile?.name}! 👋`]} typeSpeed={50} />
            <p className="text-slate-100 text-sm font-ubuntu font-bold"><NumberTicker className="text-3xl text-yellow-400" value={progress?.earnedPoints || 0} /> pontos</p>
            <div className="flex flex-col gap-2 md:max-w-1/3">
              <div className="flex flex-row justify-between items-center">
                <span className="font-ubuntu text-sm text-slate-100">Progresso</span>
                <span className="font-ubuntu text-sm text-slate-100">{progress?.progressPercentage.toFixed(2)}%</span>
              </div>
              <Progress value={progress?.progressPercentage} />
              <span className="text-xs text-slate-100 text-right font-ubuntu font-medium">{progress?.pointsToNextLevel || 0} pts para {progress?.nextLevel?.level}</span>
            </div>
          </section>
        )
      }
      <ul className="flex flex-row justify-around w-full gap-2">
        {
          isLoading ? (<div className="flex flex-col gap-2 flex-1">
            <Skeleton className="bg-linear-to-tr from-slate-300 to-slate-200 w-full h-12 rounded p-4 animate-pulse" />
            <Skeleton className="bg-linear-to-tr from-slate-300 to-slate-200 w-full h-12 rounded p-4 animate-pulse" />
          </div>) : (
            <>
              <Link href="/reader">
                <li className="flex flex-col items-center gap-1 rounded-md p-2">
                  <Image src="/images/see-code.png" alt="Icone de escanear" width={48} height={48} />
                  <p className="text-violet-900 text-xs font-bold font-ubuntu">Escanear</p>
                </li>
              </Link>
              <li className="flex flex-col items-center gap-1 rounded-md p-2">
                <Image src="/images/see-stores.png" alt="Icone de lojas" width={48} height={48} />
                <p className="text-violet-900 text-xs font-bold font-ubuntu">Ver lojas</p>
              </li>
              <li className="flex flex-col items-center gap-1 rounded-md p-2">
                <Image src="/images/see-rewards.png" alt="Icone de premios" width={48} height={48} />
                <p className="text-violet-900 text-xs font-bold font-ubuntu">Premios</p>
              </li>
              <li className="flex flex-col items-center gap-1 rounded-md p-2">
                <Image src="/images/see-levels.png" alt="Icone de niveis" width={48} height={48} />
                <p className="text-violet-900 text-xs font-bold font-ubuntu">Ver niveis</p>
              </li>
              {
                profile?.role !== "customer" && <Link href="/generate">
                  <li className="flex flex-col items-center gap-1 rounded-md p-2">
                    <Image src="/images/generate.png" alt="Icone de gerar pontos" width={48} height={48} />
                    <p className="text-violet-900 text-xs font-bold font-ubuntu">Pontuar</p>
                  </li>
                </Link>
              }
            </>
          )
        }
      </ul>
      <article className="bg-zinc-200/50 flex flex-col gap-2 w-full rounded-xl p-2">
        <section className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h3 className="text-violet-950/80 text-base font-ubuntu font-medium">Ultimas atividades</h3>
            <Link href="/history" className=""><ChevronRight size={16} className="text-slate-500" strokeWidth={3} /></Link>
          </div>
          <div className="bg-slate-100 flex flex-row justify-between items-center gap-3 rounded-xl p-2">
            <div className="bg-linear-to-tr from-yellow-600 to-yellow-500 rounded-xl p-2">
              <Clover size={20} className="text-yellow-200" />
            </div>
            <div className="flex flex-row justify-between items-center flex-1">
              <span className="text-slate-800 text-sm font-ubuntu font-medium">+50 pts loja X</span>
              <span className="text-slate-500 text-xs font-ubuntu">2 min atras</span>
            </div>
          </div>
          <div className="bg-slate-100 flex flex-row justify-between items-center gap-3 rounded-xl p-2">
            <div className="bg-linear-to-tr from-violet-600 to-violet-500 rounded-xl p-2">
              <Gift size={20} className="text-violet-200" />
            </div>
            <div className="flex flex-row justify-between items-center flex-1">
              <span className="text-slate-800 text-sm font-ubuntu font-medium">+50 pts loja X</span>
              <span className="text-slate-500 text-xs font-ubuntu">2 min atras</span>
            </div>
          </div>
          <div className="bg-slate-100 flex flex-row justify-between items-center gap-3 rounded-xl p-2">
            <div className="bg-linear-to-tr from-yellow-600 to-yellow-500 rounded-xl p-2">
              <Clover size={20} className="text-yellow-200" />
            </div>
            <div className="flex flex-row justify-between items-center flex-1">
              <span className="text-slate-800 text-sm font-ubuntu font-medium">+50 pts loja X</span>
              <span className="text-slate-500 text-xs font-ubuntu">2 min atras</span>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-violet-950/80 text-base font-ubuntu font-medium">Recompensas em destaque</h3>
          <ul className="flex flex-row overflow-x-scroll">
            {REWARDS.map((reward) => (
              <li key={reward.id} className="p-2">
                <Image src={reward.image} alt={reward.name} width={100} height={100} className="min-w-48" loading="eager" />
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4 py-4">
          <h3 className="text-violet-950/80 text-base font-ubuntu font-medium">Lojas parceiras</h3>
          <Marquee>
            <MarqueeFade className="from-slate-200 w-5" side="left" />
            <MarqueeFade className="from-slate-200 w-5" side="right" />
            <MarqueeContent>
              {PARTNERS.map((partner) => (
                <MarqueeItem key={partner.id} className="mx-4">
                  <Image src={partner.logo} alt={partner.name} className="rounded-full" width={100} height={100} />
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        </section>
      </article>
    </div>
  );
}
