// components/ArchiveCard.tsx
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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
    <Card className="flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-[#e3f2e6]">{title}</h3>
        <p className="mt-2 text-sm text-[#c7d3cb]">{description}</p>

        <p className="mt-3 text-xs text-[#a6b6ab]">
          Notes: {noteCount}
        </p>
      </div>

      <div className="flex gap-3 mt-5">
        <Button size="sm" onClick={onViewNote}>
          View Note
        </Button>

        <Button size="sm" variant="outline" href={link} target="_blank" rel="noreferrer">
          GitHub →
        </Button>
      </div>
    </Card>
  );
}
