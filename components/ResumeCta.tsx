// components/ResumeCta.tsx
"use client";

import { useState } from "react";
import ResumeLoginModal from "@/components/ResumeLoginModal";

export default function ResumeCta() {
  const [showResumeModal, setShowResumeModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowResumeModal(true)}
        className="rounded-full bg-[#4f6f58] px-5 py-2 font-medium text-[#f2f3f1] hover:bg-[#638b6d] transition-colors"
      >
        Resume
      </button>

      <ResumeLoginModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </>
  );
}
