import { ContainerProps } from "@/@types";

export const Container = ({ children, className = "" }: ContainerProps) => {
  const classname = `container max-w-6xl mx-auto ${className}`;

  return <div className={classname}>{children}</div>;
};
