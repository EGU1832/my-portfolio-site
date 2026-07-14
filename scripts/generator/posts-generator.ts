import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadPublishedMarkdown,
  type LoaderError,
  type LoaderOptions,
} from "../content-loader";
import { parseMarkdown } from "../parser/markdown-parser";
import type { Metadata, ParsedMarkdown } from "../parser/types";

export interface PostIndexEntry {
  slug: string;
  title: string;
  date?: string;
  description?: string;
  tags: string[];
  category?: string;
  thumbnail?: string;
  sourcePath: string;
}

export interface BuildPostsIndexResult {
  entries: PostIndexEntry[];
  skippedDrafts: number;
  loaderErrors: LoaderError[];
}

const DESCRIPTION_MAX_LENGTH = 180;
const OUTPUT_DIR = path.join(process.cwd(), "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "posts.json");

/** Repo-relative path from the submodule root, e.g. "Published/Notes/CSE3081.md". */
export function toSourcePath(relativePathFromPublished: string): string {
  return `Published/${relativePathFromPublished}`;
}

export function buildSlug(sourcePath: string): string {
  const withoutRoot = sourcePath.replace(/^Published\//, "");
  const withoutExt = withoutRoot.replace(/\.md$/i, "");

  return withoutExt
    .split("/")
    .map((segment) => segment.trim().toLowerCase().replace(/\s+/g, "-"))
    .join("/");
}

export function resolveCategory(
  metadata: Metadata,
  sourcePath: string,
): string | undefined {
  if (metadata.category && metadata.category.trim().length > 0) {
    return metadata.category.trim();
  }

  const segments = sourcePath.replace(/^Published\//, "").split("/");
  // A file directly under Published/ (no subfolder) has no inferable category.
  if (segments.length < 2) return undefined;

  return segments[0];
}

export function buildDescription(
  content: string,
  existingDescription?: string,
): string | undefined {
  if (existingDescription && existingDescription.trim().length > 0) {
    return existingDescription.trim();
  }

  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length === 0) return undefined;
  if (plain.length <= DESCRIPTION_MAX_LENGTH) return plain;
  return `${plain.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd()}...`;
}

export function toPostIndexEntry(parsed: ParsedMarkdown): PostIndexEntry {
  return {
    slug: buildSlug(parsed.sourcePath),
    title: parsed.metadata.title,
    date: parsed.metadata.date,
    description: buildDescription(parsed.content, parsed.metadata.description),
    tags: parsed.metadata.tags,
    category: resolveCategory(parsed.metadata, parsed.sourcePath),
    thumbnail: parsed.metadata.thumbnail,
    sourcePath: parsed.sourcePath,
  };
}

export async function buildPostsIndex(
  loaderOptions?: LoaderOptions,
): Promise<BuildPostsIndexResult> {
  const { files, errors } = await loadPublishedMarkdown(loaderOptions);

  const entries: PostIndexEntry[] = [];
  let skippedDrafts = 0;

  for (const file of files) {
    const sourcePath = toSourcePath(file.relativePath);
    const parsed = parseMarkdown(file.content, sourcePath);

    if (parsed.metadata.draft) {
      skippedDrafts += 1;
      continue;
    }

    entries.push(toPostIndexEntry(parsed));
  }

  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  return { entries, skippedDrafts, loaderErrors: errors };
}

export async function writePostsIndex(
  entries: PostIndexEntry[],
  outputFile: string = OUTPUT_FILE,
): Promise<void> {
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(entries, null, 2), "utf8");
}

async function main() {
  const { entries, skippedDrafts, loaderErrors } = await buildPostsIndex();

  for (const error of loaderErrors) {
    console.error(`[posts-generator] ${error.reason}: ${error.path}`);
  }

  await writePostsIndex(entries);

  console.log(
    `Generated ${entries.length} posts (${skippedDrafts} draft skipped) -> ${path.relative(
      process.cwd(),
      OUTPUT_FILE,
    )}`,
  );
}

const isDirectRun =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  void main();
}
