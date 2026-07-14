import * as fs from "node:fs/promises";
import * as path from "node:path";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// gray-matter uses CommonJS export = syntax; require keeps typings correct.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grayMatter = require("gray-matter") as typeof import("gray-matter");
type PostRecord = {
  slug: string;
  title: string;
  sourcePath: string;
};

async function readPostsIndex(): Promise<PostRecord[]> {
  const indexFilePath = path.join(process.cwd(), "generated", "posts.json");
  try {
    const raw = await fs.readFile(indexFilePath, "utf8");
    return JSON.parse(raw) as PostRecord[];
  } catch {
    return [];
  }
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await readPostsIndex();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const normalizedSlug = decodeURIComponent(slug);

  const posts = await readPostsIndex();
  const post = posts.find((entry) => entry.slug === normalizedSlug);

  if (!post) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "content", "obsidian", post.sourcePath);

  let raw = "";
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const { content } = grayMatter(raw) as { content: string };

  return (
    <main className="min-h-screen bg-[#0d120f] px-6 py-12 text-[#f2f3f1]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold">{post.title}</h1>
        <MarkdownRenderer markdown={content} />
      </div>
    </main>
  );
}

