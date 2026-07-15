// components/NoteModal.tsx
"use client";

import MarkdownRenderer from "./MarkdownRenderer";
import ModalOverlay from "@/components/ui/ModalOverlay";

export default function NoteModal({
  isOpen,
  onClose,
  title,
  markdown,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  markdown: string;
}) {
  return (
    <ModalOverlay isOpen={isOpen}>
      <div className="w-[90%] max-w-3xl h-[85vh] bg-[#0d120f] rounded-xl border border-[#4f6f58]/40 shadow-xl overflow-hidden flex flex-col">

        <div className="flex justify-between items-center px-4 py-3 border-b border-[#4f6f58]/40 bg-[#121813]">
          <h2 className="text-sm font-semibold text-[#cfe8d6]">{title}</h2>

          <button
            className="text-[#a5b8ac] hover:text-white transition text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto grow custom-scroll text-xs sm:text-sm md:text-base">
          <MarkdownRenderer markdown={markdown} />
        </div>
      </div>
    </ModalOverlay>
  );
}
