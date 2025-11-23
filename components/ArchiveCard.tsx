// components/ArchiveCard.tsx

export default function ArchiveCard({
  title,
  description,
  noteCount,
  link,
  onViewNote,
}: {
  title: string;
  description: string;
  noteCount: number;
  link: string;
  onViewNote: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#4f6f58]/40 bg-[#101711] p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-[#e3f2e6]">{title}</h3>
        <p className="mt-2 text-sm text-[#c7d3cb]">{description}</p>

        <p className="mt-3 text-xs text-[#a6b6ab]">
          Notes: {noteCount}
        </p>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={onViewNote}
          className="text-xs px-3 py-1.5 rounded-md bg-[#4f6f58] text-[#f2f3f1] hover:bg-[#6a8a74] transition"
        >
          View Note
        </button>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-xs px-3 py-1.5 rounded-md bg-[#1b261f] text-[#b8d9c2] border border-[#4f6f58]/40 hover:bg-[#24342a] transition"
        >
          GitHub →
        </a>
      </div>
    </div>
  );
}
