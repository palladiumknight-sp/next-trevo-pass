import {
  UserRound,
  ShieldCheck,
  Settings,
  Headset,
  type LucideIcon,
} from "lucide-react";

type ProfileModal = "data" | "security" | "settings" | "support";

interface ProfileMenuItem {
  id: ProfileModal;
  label: string;
  icon: LucideIcon;
}

export const PROFILE_MENU: ProfileMenuItem[] = [
  {
    id: "data",
    label: "Meus Dados",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Segurança",
    icon: ShieldCheck,
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
  },
  {
    id: "support",
    label: "Suporte",
    icon: Headset,
  },
];
