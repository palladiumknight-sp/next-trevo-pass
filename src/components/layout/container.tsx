import { ContainerProps } from "@/@types";

export const Container = ({ children, className = "" }: ContainerProps) => {
  const classname = `w-screen min-h-screen mx-auto  ${className}`;

  return <div className={classname}>{children}</div>;
};
