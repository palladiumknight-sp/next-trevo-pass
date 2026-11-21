import { ContainerProps } from "@/@types";
import { cn } from "@/lib/utils";

const maxWidthClasses = {
  full: "max-w-full",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "7xl": "max-w-7xl",
} as const;

export const Container = ({
  children,
  className,
  maxWidth = "7xl",
}: ContainerProps) => {
  return (
    <section
      className={cn("w-full mx-auto", maxWidthClasses[maxWidth], className)}
    >
      {children}
    </section>
  );
};
