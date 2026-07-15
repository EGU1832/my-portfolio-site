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
  date?: string;
  description?: string;
  tags?: string[];
  category?: string;
  sourcePath: string;
};

function formatDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

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
    <main className="min-h-screen bg-[#0b0d0b] px-6 py-12 text-[#f2f3f1]">
      <div className="mx-auto max-w-3xl">
        <header
          className="relative mb-8 overflow-hidden rounded-2xl border border-[#4f6f58]/40 px-6 py-6 backdrop-blur"
          style={{
            background:
              "linear-gradient(135deg, rgba(79,111,88,.18), rgba(79,111,88,.05) 45%, transparent)",
          }}
        >
          {post.category ? (
            <span className="font-mono text-xs text-[#d1e4d5]">
              {post.category}
            </span>
          ) : null}

          <h1 className="mt-3 mx-2 text-4xl font-semibold text-[#e3efe5]">{post.title}</h1>

          {post.date ? (
            <time className="mt-2 block text-xs text-[#9aa69c]">
              {formatDate(post.date)}
            </time>
          ) : null}

          {post.description ? (
            <p className="mt-3 mx-2 text-sm text-[#cbd5ce]">{post.description}</p>
          ) : null}

          {post.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono rounded-lg bg-[#4f6f58]/60 px-3 py-1 text-[#d1e4d5]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <MarkdownRenderer markdown={content} />
      </div>
    </main>
  );
}

