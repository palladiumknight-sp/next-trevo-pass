"use client";

import { FormEvent, useState } from "react";
import { Mail, Save } from "lucide-react";

import { LaminatedButton } from "@/components/ui/laminated";
import { ProfileModal } from "./page";
import { UserRead } from "@/@types";
import { toast } from "sonner";
import { updateUserController } from "@/features/users/controllers/user.controller";

interface EditProfileFormProps {
  profile: UserRead;
  setProfile: (profile: UserRead) => void;
  setActiveModal: (state: ProfileModal | null) => void;
  setIsSaving: (state: boolean) => void;
  isSaving: boolean;
}

export function EditProfileForm({
  profile,
  setProfile,
  setActiveModal,
  setIsSaving,
  isSaving,
}: EditProfileFormProps) {
  const [name, setName] = useState(profile.name);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      toast.error("Informe seu nome para continuar.");
      return;
    }

    if (normalizedName === profile.name) {
      setActiveModal(null);
      return;
    }

    try {
      setIsSaving(true);
      const updatedProfile = await updateUserController(profile.id, {
        name: normalizedName,
      });

      if (updatedProfile) setProfile(updatedProfile as UserRead);
      setName(normalizedName);
      setActiveModal(null);
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

  const onClose = () => {
    setName(profile?.name ?? "");
    setActiveModal(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-violet-950">
        Nome
        <input
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          className="rounded-xl border border-violet-200 bg-violet-50/40 px-3 py-2.5 font-normal text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-violet-950">
        E-mail
        <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-600">
          <Mail size={17} aria-hidden="true" />

          <span className="min-w-0 flex-1 truncate">
            {profile.email || "—"}
          </span>
        </span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-violet-950">
        Telefone
        <input
          value={profile.phone || "—"}
          readOnly
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-600 outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-violet-950">
        CPF
        <input
          value={profile.cpf || "—"}
          readOnly
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-600 outline-none"
        />
      </label>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <LaminatedButton type="submit" disabled={isSaving || !name.trim()}>
          <Save size={17} aria-hidden="true" />
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </LaminatedButton>
      </div>
    </form>
  );
}
