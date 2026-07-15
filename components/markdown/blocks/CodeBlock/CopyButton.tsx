"use client";

import { useState } from "react";
import styles from "./CopyButton.module.css";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing to fall back to.
    }
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
