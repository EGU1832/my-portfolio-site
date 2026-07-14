import * as fs from "node:fs/promises";
import * as path from "node:path";
import PostsListClient from "./PostsListClient";

type PostRecord = {
  slug: string;
  title?: string;
  date?: string;
  tags?: string[] | string;
  description?: string;
};

export default async function PostsPage() {
  const filePath = path.join(process.cwd(), "generated", "posts.json");

  let posts: PostRecord[] = [];
  try {
    const raw = await fs.readFile(filePath, "utf8");
    posts = JSON.parse(raw) as PostRecord[];
  } catch {
    // If the JSON hasn't been generated yet, show an empty state.
    posts = [];
  }

  return (
    <main className="min-h-screen bg-[#0b0d0b] text-[#f2f3f1]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center gap-3">
          <a
            href="/"
            aria-label="Back to home"
            className="inline-block"
          >
            <img src="/favicon.ico" alt="" className="h-7 w-7" />
          </a>
          <h1 className="text-2xl font-semibold">Posts</h1>
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 text-sm text-[#cbd5ce]">
            No posts found. Run `npm run generate-posts` to create `generated/posts.json`.
          </p>
        ) : (
          <PostsListClient posts={posts} />
        )}
      </div>
    </main>
  );
}

