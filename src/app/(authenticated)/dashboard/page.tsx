"use client";

import { ChevronRight, Clover, Gift, } from "lucide-react";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Progress } from "@/components/ui/progress";
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

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRead | undefined>(undefined);

  useEffect(() => {
    async function loadUser() {
      if (!user) return;

      const profileFinded = await getUserByIdController(user.uid) as UserRead | undefined;

      setProfile(profileFinded);
    }

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
    <div className="flex flex-col items-center justify-center gap-4 p-2 md:p-4">
      <section className="bg-linear-to-tr from-blue-900 to-violet-600 w-full rounded-tl-4xl rounded-br-lg p-4">
        <TypingAnimation className="text-slate-100 text-lg font-ubuntu font-bold" words={[`Ola, ${profile?.name}! 👋`]} typeSpeed={50} />
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
      <ul className="flex flex-row justify-around w-full gap-2">
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
      </ul>
      <article className="bg-zinc-200/50 flex flex-col gap-2 w-full rounded-xl p-2">
        <section className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h3 className="text-violet-950/80 text-sm font-ubuntu font-medium">Ultimas atividades</h3>
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
          <h3 className="text-violet-950/80 text-sm font-ubuntu font-medium">Recompensas em destaque</h3>
          <ul className="flex flex-row overflow-scroll">
            {REWARDS.map((reward) => (
              <li key={reward.id} className="p-2">
                <Image src={reward.image} alt={reward.name} width={100} height={100} className="min-w-48" loading="eager" />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-violet-950/80 text-sm font-ubuntu font-medium">Lojas parceiras</h3>
          <ul>
            <li>
              Live!
            </li>
            <li>
              American Card Express
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
