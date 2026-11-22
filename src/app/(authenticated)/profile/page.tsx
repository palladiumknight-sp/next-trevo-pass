"use client";

import {
  BadgeCheck,
  CreditCard,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { UserRead, UserRole } from "@/@types";

import { LaminatedButton } from "@/components/ui/laminated";
import { Skeleton } from "@/components/ui";
import { getUserByIdController } from "@/features/users/controllers/user.controller";
import { logoutUser } from "@/features/auth/repositories/auth.repository";
import { toast } from "sonner";
import { updateUserController } from "@/features/users/controllers/user.controller";
import { useAuth } from "@/contexts/auth-context";

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Cliente",
  employee: "Funcionário",
  manager: "Gestor",
  admin: "Administrador",
};

const PROFILE_FIELDS = [
  { key: "email", label: "E-mail", icon: Mail },
  { key: "phone", label: "Telefone", icon: Phone },
  { key: "cpf", label: "CPF", icon: CreditCard },
] as const;

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRead | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

        const userProfile = result as UserRead;
        setProfile(userProfile);
        setName(userProfile.name);
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

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!profile || !normalizedName) {
      toast.error("Informe seu nome para continuar.");
      return;
    }

    if (normalizedName === profile.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const updatedProfile = await updateUserController(profile.id, {
        name: normalizedName,
      });

      if (updatedProfile) setProfile(updatedProfile as UserRead);
      setName(normalizedName);
      setIsEditing(false);
      toast.success("Nome atualizado com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar seu nome.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(profile?.name ?? "");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold text-violet-950">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-600">
          Consulte seus dados e gerencie sua conta.
        </p>
      </header>

      {isLoading ? (
        <>
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-60 w-full rounded-2xl" />
        </>
      ) : !profile ? (
        <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-slate-700">
            Não foi possível carregar os dados do perfil.
          </p>
        </section>
      ) : (
        <>
          <section className="flex items-center gap-4 rounded-2xl bg-linear-to-tr from-violet-950 to-violet-700 p-5 text-white shadow-sm">
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
          </section>

          <section className="grid grid-cols-2 gap-3">
            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Saldo de pontos
              </p>
              <p className="mt-1 text-2xl font-bold text-violet-900">
                {profile.points.toLocaleString("pt-BR")}
              </p>
            </article>
            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Nível atual</p>
              <p className="mt-1 text-2xl font-bold capitalize text-violet-900">
                {profile.level}
              </p>
            </article>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-violet-950">
                  Dados pessoais
                </h2>
                <p className="text-sm text-slate-500">
                  Seus dados cadastrados na conta.
                </p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
                >
                  <Pencil size={16} aria-hidden="true" />
                  Editar nome
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                Nome
                <input
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  readOnly={!isEditing}
                  required
                  maxLength={100}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-100 read-only:text-slate-600"
                />
              </label>

              {PROFILE_FIELDS.map(({ key, label, icon: Icon }) => (
                <label
                  key={key}
                  className="flex flex-col gap-1.5 text-sm font-medium text-slate-700"
                >
                  {label}
                  <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-600">
                    <Icon size={16} aria-hidden="true" />
                    <input
                      value={profile[key] || "—"}
                      readOnly
                      aria-label={label}
                      className="min-w-0 flex-1 bg-transparent outline-none"
                    />
                  </span>
                </label>
              ))}

              {isEditing && (
                <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <X size={16} aria-hidden="true" />
                    Cancelar
                  </button>
                  <LaminatedButton
                    type="submit"
                    disabled={isSaving || !name.trim()}
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <Save size={16} aria-hidden="true" />
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                  </LaminatedButton>
                </div>
              )}
            </form>
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
    </main>
  );
}
