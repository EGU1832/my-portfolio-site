// components/ArchiveSection.tsx
"use client";

import { useState } from "react";
import ArchiveCard from "./ArchiveCard";
import NoteModal from "./NoteModal";

const archiveData = [
  {
    title: "CSE3081 — Algorithm Design and Analysis",
    description: "Algorithm design paradigms including divide-and-conquer, dynamic programming, greedy strategies etc.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE3081.md",
  },
  {
    title: "CSE4010 — Computer Architecture",
    description: "Pipeline, cache, superscalar, branch prediction, and more.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE4010.md",
  },
  {
    title: "CSE4100 — System Programming",
    description: "Processes, memory, filesystems, concurrency, debugging.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE4100.md",
  },
  {
    title: "CSE4104 — Hacking & Security",
    description: "Security fundamentals, vulnerabilities, exploit concepts.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE4104.md",
  },
  {
    title: "CSE4170 — Computer Graphics",
    description: "Rasterization, shading, transformation, texture mapping.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE4170.md",
  },
  {
    title: "CSE4175 — Computer Network",
    description: "TCP/IP, routing, congestion control, link layer concepts.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE4175.md",
  },
  {
    title: "CSE6449 — Real-Time Rendering",
    description: "Rendering pipelines, PBR, real-time optimizations.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSE6449.md",
  },
  {
    title: "CSEG483 — GPU Programming",
    description: "CUDA fundamentals, kernels, shared memory, optimization.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/CSEG483.md",
  },
  {
    title: "glTF — In Nutshell",
    description: "glTF ecosystem, structure, materials, PBR extension.",
    noteCount: 1,
    link: "https://github.com/EGU1832/Archive/blob/main/glTF.md",
  },
];

export default function ArchiveSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");

  const openNote = async (item: any) => {
    const slug = item.title.split("—")[0].trim();
    const url = `/archive-md/${slug}.md`;   // public/archive-md 에 저장된 markdown

    const res = await fetch(url);
    const text = await res.text();

    setCurrentNote(text);
    setCurrentTitle(item.title);
    setIsOpen(true);
  };

  return (
    <section id="archive" className="py-12">
      <h2 className="section-title">Archive</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {archiveData.map((item) => (
          <ArchiveCard
            key={item.title}
            {...item}
            onViewNote={() => openNote(item)}   // ⬅ 추가
          />
        ))}
      </div>

      <NoteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={currentTitle}
        markdown={currentNote || ""}
      />
    </section>
  );
}
