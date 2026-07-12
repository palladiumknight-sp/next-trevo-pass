export const laminatedBase =
  "relative inline-flex items-center justify-center overflow-hidden rounded-md font-semibold transition-all focus:outline-none focus:ring-2 active:translate-y-[1px]";

export const laminatedSizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3 text-xl",
};

export const laminatedVariants = {
  yellow: {
    bg: "bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500",
    text: "text-violet-900",
    ring: "ring-yellow-300",
    shadow: "shadow-lg shadow-violet-900/35",
    hover: "hover:from-yellow-400 hover:to-yellow-600",
  },
  violet: {
    bg: "bg-gradient-to-b from-violet-400 via-violet-500 to-violet-600",
    text: "text-slate-100",
    ring: "ring-violet-400",
    shadow: "shadow-lg shadow-violet-900/40",
    hover: "hover:from-violet-500 hover:to-violet-700",
  },
  slate: {
    bg: "bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400",
    text: "text-violet-900",
    ring: "ring-slate-400",
    shadow: "shadow-lg shadow-slate-900/40",
    hover: "hover:from-slate-200 hover:to-slate-500",
  },
};
