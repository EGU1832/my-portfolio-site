import type { ReactNode } from "react";

export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#4f6f58]/40 bg-[#101711] p-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
