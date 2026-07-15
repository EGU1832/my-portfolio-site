import type { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-semibold tracking-wide text-[#e3f2e6]">
      {children}
    </h2>
  );
}
