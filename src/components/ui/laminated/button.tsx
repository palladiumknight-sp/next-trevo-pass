import { laminatedBase, laminatedSizes, laminatedVariants } from "./styles";

type LaminatedButtonProps = {
  color?: "yellow" | "violet" | "slate";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function LaminatedButton({
  color = "yellow",
  size = "md",
  className = "",
  children,
  ...props
}: LaminatedButtonProps) {
  const v = laminatedVariants[color];

  return (
    <button
      {...props}
      className={`
        cursor-pointer
        ${laminatedBase}
        ${laminatedSizes[size]}
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

      <span className="relative z-10 font-ubuntu inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
