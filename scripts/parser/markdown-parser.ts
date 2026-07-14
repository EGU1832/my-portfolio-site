import * as fs from "node:fs/promises";

// gray-matter uses CommonJS export = syntax; require keeps typings correct.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grayMatter = require("gray-matter") as typeof import("gray-matter");

import type { Metadata, ParsedMarkdown } from "./types";

function basenameOf(sourcePath: string): string {
  const segments = sourcePath.split(/[\\/]/);
  return segments[segments.length - 1] ?? sourcePath;
}

function deriveTitleFromPath(sourcePath: string): string {
  return basenameOf(sourcePath).replace(/\.md$/i, "");
}

export function normalizeTags(rawTags: unknown): string[] {
  if (Array.isArray(rawTags)) {
    return rawTags
      .map((tag) => (typeof tag === "string" ? tag : String(tag)))
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
  if (typeof rawTags === "string") {
    return rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
  return [];
}

export function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
}

export function normalizeDraft(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return false;
}

export function buildMetadata(
  rawData: Record<string, unknown>,
  sourcePath: string,
): Metadata {
  return {
    title: normalizeOptionalString(rawData.title) ?? deriveTitleFromPath(sourcePath),
    date: normalizeOptionalString(rawData.date),
    tags: normalizeTags(rawData.tags),
    description: normalizeOptionalString(rawData.description),
    category: normalizeOptionalString(rawData.category),
    thumbnail: normalizeOptionalString(rawData.thumbnail),
    draft: normalizeDraft(rawData.draft),
  };
}

/**
 * Pure parser: splits raw markdown text into metadata + content.
 * Frontmatter presence/absence is entirely decided by gray-matter's own
 * result (`data` is `{}` when there is none) — never by sniffing the
 * raw string for a leading "---" ourselves.
 */
export function parseMarkdown(raw: string, sourcePath: string): ParsedMarkdown {
  let data: Record<string, unknown> = {};
  let content = raw;

  try {
    const parsed = grayMatter(raw);
    data = parsed.data as Record<string, unknown>;
    content = parsed.content;
  } catch {
    // Malformed YAML block: fail safe, treat the file as plain content.
    data = {};
    content = raw;
  }

  return {
    metadata: buildMetadata(data, sourcePath),
    content,
    sourcePath,
  };
}

/**
 * IO wrapper around parseMarkdown. Returns null instead of throwing when
 * the file can't be read, so callers can skip a bad file without aborting
 * a batch run.
 */
export async function parseMarkdownFile(
  absolutePath: string,
  sourcePath: string,
): Promise<ParsedMarkdown | null> {
  try {
    const raw = await fs.readFile(absolutePath, "utf8");
    return parseMarkdown(raw, sourcePath);
  } catch {
    return null;
  }
}
