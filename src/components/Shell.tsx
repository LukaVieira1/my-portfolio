import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
  className?: string;
}

export function Shell({ children, className = "" }: ShellProps) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-[2200px] px-5 md:px-10 xl:px-16 2xl:px-24 ${className}`}
    >
      {children}
    </div>
  );
}
