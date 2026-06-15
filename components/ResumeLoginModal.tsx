"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeLoginModal({
  isOpen,
  onClose,
}: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit() {
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (!res.ok) {
      setError("Invalid password");
      return;
    }

    router.push("/resume");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl bg-[#111712] p-6 border border-[#4f6f58]">
  
        <h2 className="text-lg font-semibold text-white">
          Resume Access
        </h2>
  
        <p className="mt-2 text-sm text-gray-400">
          Enter password to view resume.
        </p>
  
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
  
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-lg border border-[#4f6f58] bg-[#0b0d0b] px-3 py-2"
            placeholder="Password"
          />
  
          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
  
          <div className="mt-4 flex gap-2">
  
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#4f6f58] py-2"
            >
              Enter
            </button>
  
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#4f6f58]"
            >
              Cancel
            </button>
  
          </div>
  
        </form>
  
      </div>
    </div>
  );
}