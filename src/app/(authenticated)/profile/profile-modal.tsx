import { useCallback, useEffect } from "react";

import { EditProfileForm } from "./edit-profile-form";
import { ResetPasswordForm } from "./reset-password-form";
import { User } from "firebase/auth";
import { UserRead } from "@/@types";
import { X } from "lucide-react";

interface ProfileModalProps {
  activeModal: "data" | "security" | null;
  profile: UserRead | null;
  user: User | null;
  isSaving: boolean;
  setProfile: (profile: UserRead) => void;
  setIsSaving: (isSaving: boolean) => void;
  setActiveModal: (modal: "data" | "security" | null) => void;
}

export const ProfileModal = ({
  user,
  profile,
  isSaving,
  activeModal,
  setProfile,
  setIsSaving,
  setActiveModal,
}: ProfileModalProps) => {
  const handleCancel = useCallback(
    () => setActiveModal(null),
    [setActiveModal],
  );

  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) handleCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, handleCancel, isSaving]);

  return (
    activeModal &&
    profile && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-violet-950/45 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !isSaving) handleCancel();
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          className="max-h-[min(90vh,48rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_20px_60px_rgba(46,16,101,0.30)] sm:p-7"
        >
          <header className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2
                id="profile-modal-title"
                className="text-xl font-bold text-violet-950 sm:text-2xl"
              >
                {activeModal === "data" && "Meus dados"}
                {activeModal === "security" && "Segurança"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {activeModal === "data" &&
                  "Confira e atualize as informações do seu perfil."}
                {activeModal === "security" &&
                  "Gerencie o acesso e a senha da sua conta."}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fechar janela"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          {activeModal === "data" && (
            <EditProfileForm
              profile={profile}
              isSaving={isSaving}
              setProfile={setProfile}
              setIsSaving={setIsSaving}
              setActiveModal={setActiveModal}
            />
          )}

          {activeModal === "security" && (
            <ResetPasswordForm user={user} setActiveModal={setActiveModal} />
          )}
        </section>
      </div>
    )
  );
};
