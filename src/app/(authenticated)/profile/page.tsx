"use client";

import {
  BadgeCheck,
  ChevronRight,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { UserRead, UserRole } from "@/@types";
import { useEffect, useState } from "react";

import { PROFILE_MENU } from "@/data/profile-menu";
import { ProfileModal } from "./profile-modal";
import { Skeleton } from "@/components/ui";
import { getUserByIdController } from "@/features/users/controllers/user.controller";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export type ProfileModal = "data" | "security" | null;

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Cliente",
  employee: "Funcionário",
  manager: "Gestor",
  admin: "Administrador",
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<ProfileModal>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getUserByIdController(user.uid);
        if (cancelled || !result) return;

        setProfile(result as UserRead);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar seu perfil.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Você saiu da sua conta.");
    } catch {
      toast.error("Não foi possível sair da conta. Tente novamente.");
    }
  };

  const initials = profile?.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 pb-5 pt-5 md:px-6 md:pb-8">
      <header>
        <h1 className="text-2xl font-bold text-violet-950">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-600">
          Consulte seus dados e gerencie sua conta.
        </p>
      </header>

      {isLoading ? (
        <>
          <Skeleton className="h-80 w-full rounded-4xl" />
          <Skeleton className="h-72 w-full rounded-4xl" />
        </>
      ) : !profile ? (
        <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-slate-700">
            Não foi possível carregar os dados do perfil.
          </p>
        </section>
      ) : (
        <>
          <section className="relative pb-3">
            <div className="relative h-full overflow-hidden rounded-t-[2rem] rounded-br-2xl bg-linear-to-r from-violet-900 via-violet-700 to-fuchsia-500">
              <div className="absolute -right-8 -top-14 size-48 rounded-full border-24 border-white/10" />
              <div className="flex items-center gap-4 rounded-2xl p-5 text-white">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-violet-950">
                  {initials || <UserRound aria-hidden="true" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-bold">{profile.name}</h2>
                  <p className="mt-1 text-sm text-violet-100">
                    {ROLE_LABELS[profile.role]}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                  <BadgeCheck size={16} aria-hidden="true" />
                  {profile.status === "active" ? "Ativa" : profile.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-5">
                <span className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">
                    Saldo de pontos
                  </p>
                  <p className="mt-1 text-2xl font-bold text-violet-900">
                    {profile.points.toLocaleString("pt-BR")}
                  </p>
                </span>
                <span className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">
                    Nível atual
                  </p>
                  <p className="mt-1 text-2xl font-bold capitalize text-violet-900">
                    {profile.level}
                  </p>
                </span>
              </div>
              <div className="absolute left-1/2 top-7 size-2 rounded-full bg-fuchsia-200 shadow-[0_0_16px_5px_rgba(255,255,255,0.6)]" />
              <div className="absolute right-24 top-12 size-2 rounded-full bg-white/80 shadow-[0_0_14px_4px_rgba(255,255,255,0.5)]" />
            </div>
          </section>
          <section
            aria-label="Opções do perfil"
            className="flex flex-col gap-3 px-1"
          >
            {PROFILE_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "data") {
                      // setName(profile.name);
                    }

                    if (item.id !== "security" && item.id !== "data") {
                      toast.error(
                        "Esta funcionalidade ainda não está disponível.",
                        { id: "not-available" },
                      );
                      return;
                    }

                    setActiveModal(item.id);
                  }}
                  className="flex min-h-19 items-center gap-4 rounded-3xl border border-violet-100 bg-white px-5 text-left text-violet-800 shadow-[0_5px_14px_rgba(91,33,182,0.10)] transition hover:-translate-y-0.5 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                >
                  <Icon size={29} className="shrink-0 text-violet-600" />
                  <span className="flex-1 text-lg font-semibold sm:text-xl">
                    {item.label}
                  </span>
                  <ChevronRight size={25} className="text-violet-300" />
                </button>
              );
            })}
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-violet-800"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-bold text-slate-800">Segurança da conta</h2>
                <p className="text-sm text-slate-500">
                  Para alterar e-mail ou senha, use as opções de recuperação de
                  conta.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              <LogOut size={17} aria-hidden="true" />
              Sair da conta
            </button>
          </section>
        </>
      )}
      <ProfileModal
        activeModal={activeModal}
        profile={profile}
        user={user}
        isSaving={isSaving}
        setProfile={setProfile}
        setIsSaving={setIsSaving}
        setActiveModal={setActiveModal}
      />
    </main>
  );
}
