import * as fs from "node:fs/promises";
import * as path from "node:path";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// gray-matter uses CommonJS export = syntax; require keeps typings correct.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grayMatter = require("gray-matter") as typeof import("gray-matter");
type PostRecord = {
  slug: string;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const indexFilePath = path.join(process.cwd(), "generated", "posts.json");
  try {
    const raw = await fs.readFile(indexFilePath, "utf8");
    const posts = JSON.parse(raw) as PostRecord[];
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const normalizedSlug = decodeURIComponent(slug);
  const filePath = path.join(process.cwd(), "content", "posts", `${normalizedSlug}.md`);

  let raw = "";
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const { data, content } = grayMatter(raw) as {
    data: Record<string, unknown>;
    content: string;
  };

  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title
      : normalizedSlug;

  return (
    <main className="min-h-screen bg-[#0d120f] px-6 py-12 text-[#f2f3f1]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
        <MarkdownRenderer markdown={content} />
      </div>
    </main>
  );
}

