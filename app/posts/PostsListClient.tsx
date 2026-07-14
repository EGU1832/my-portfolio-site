"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PostRecord = {
  slug: string;
  title?: string;
  date?: string;
  tags?: string[] | string;
  description?: string;
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

function normalizeTags(tags: PostRecord["tags"]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (tags.includes(",")) {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [tags].filter(Boolean);
}

export default function PostsListClient({ posts }: { posts: PostRecord[] }) {
  const [activeTag, setActiveTag] = useState<string>("All");

  const sorted = useMemo(
    () =>
      posts
        .slice()
        .sort(
          (a, b) =>
            Number(new Date(b.date ?? "").getTime()) -
            Number(new Date(a.date ?? "").getTime()),
        ),
    [posts],
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const post of sorted) {
      for (const tag of normalizeTags(post.tags)) tags.add(tag);
    }
    return ["All", ...Array.from(tags).sort()];
  }, [sorted]);

  const filtered = useMemo(() => {
    if (activeTag === "All") return sorted;
    return sorted.filter((post) => normalizeTags(post.tags).includes(activeTag));
  }, [activeTag, sorted]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border px-3 py-1 transition-colors ${
              activeTag === tag
                ? "border-[#638b6d] bg-[#1a2a20] text-[#e3efe5]"
                : "border-[#4f6f58]/60 text-[#d1e4d5] hover:bg-[#18251c]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-[#cbd5ce]">No posts matched this tag.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {filtered.map((post) => {
            const tags = normalizeTags(post.tags);
            return (
              <li
                key={post.slug}
                className="rounded-2xl border border-[#4f6f58]/40 bg-[#111712] px-5 py-4"
              >
                <h2 className="text-base font-semibold text-[#e2efe4]">
                  <Link
                    href={`/posts/${encodeURIComponent(post.slug)}`}
                    className="hover:underline"
                  >
                    {post.title ?? post.slug}
                  </Link>
                </h2>

                {post.date ? (
                  <time className="mt-1 block text-xs text-[#9aa69c]">
                    {formatDate(post.date)}
                  </time>
                ) : null}

                {tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#4f6f58]/60 px-3 py-1 text-[#d1e4d5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {post.description ? (
                  <p className="mt-3 text-sm text-[#cbd5ce]">{post.description}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
