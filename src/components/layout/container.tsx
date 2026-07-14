interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className="" }: ContainerProps) => {
  const classname = `container max-w-6xl mx-auto ${className}`;

  return <div className={classname}>{children}</div>;
};
