type LaminatedButtonProps = {
  color?: "yellow" | "violet" | "slate";
  size?: "sm" | "md" | "lg";
  className?: string;
  as: "button" | "a";
  children: React.ReactNode;
};

export function LaminatedButton({
  color = "yellow",
  size = "md",
  className = "",
  children,
  as,
  ...props
}: LaminatedButtonProps) {
  const base =
    "relative overflow-hidden rounded-md font-semibold transition-all " +
    "focus:outline-none focus:ring-2 active:translate-y-[1px]";

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-xl", 
  };

  const variants = {
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

  const v = variants[color];

  const Component = as;

  return (
    <Component
      {...props}
      className={`
        cursor-pointer
        ${base}
        ${sizes[size]}
        ${v.bg}
        ${v.text}
        ${v.ring}
        ${v.shadow}
        ${v.hover}
        ${className}
      `}
    >
      <span
        className="
          pointer-events-none
          absolute inset-x-1 top-1
          h-3 rounded-md
          bg-linear-to-b from-white/40 to-transparent
        "
      />
      <span className="relative z-10 font-ubuntu">{children}</span>
    </Component>
  );
}
