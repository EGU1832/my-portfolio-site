import fs from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function ArchiveNotePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const filePath = path.join(process.cwd(), "public", "archive-md", `${slug}.md`);
  
  let markdown = "";
  try {
    markdown = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    markdown = "# Not Found\nThis note does not exist.";
  }

  return (
    <main className="min-h-screen px-6 py-12 bg-[#0b0d0b] text-[#f2f3f1]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 capitalize">{slug}</h1>
        {/* ❗ MarkdownRenderer는 client component */}
        <MarkdownRenderer markdown={markdown} />
      </div>
    </main>
  );
}
