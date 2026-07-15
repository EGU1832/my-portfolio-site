import type { ReactNode } from "react";

export default function ModalOverlay({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {children}
    </div>
  );
}
