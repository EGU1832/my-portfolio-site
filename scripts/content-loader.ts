import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export interface MarkdownFile {
  absolutePath: string;
  relativePath: string;
  slugCandidate: string;
  content: string;
}

export interface LoaderError {
  path: string;
  reason: "root_not_found" | "unreadable" | "symlink_skipped" | "slug_collision";
  detail?: string;
  cause?: unknown;
}

export interface LoaderOptions {
  rootDir?: string;
  extensions?: string[];
  ignoreDirNames?: string[];
}

export interface LoaderResult {
  files: MarkdownFile[];
  errors: LoaderError[];
}

export const DEFAULT_ROOT_DIR = path.join(
  process.cwd(),
  "content",
  "obsidian",
  "Published",
);
export const DEFAULT_EXTENSIONS = [".md"];
export const DEFAULT_IGNORE_DIR_NAMES = [".obsidian", ".trash", ".git", "node_modules"];

export function isMarkdownExtension(
  fileName: string,
  extensions: string[] = DEFAULT_EXTENSIONS,
): boolean {
  const lower = fileName.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext.toLowerCase()));
}

export function isIgnoredDir(
  dirName: string,
  ignoreDirNames: string[] = DEFAULT_IGNORE_DIR_NAMES,
): boolean {
  return ignoreDirNames.includes(dirName);
}

export function toRelativePath(absolutePath: string, rootDir: string): string {
  return path.relative(rootDir, absolutePath).replace(/\\/g, "/");
}

export function slugifySegment(segment: string): string {
  return segment
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function toSlugCandidate(relativePath: string): string {
  const withoutExt = relativePath.replace(/\.md$/i, "");
  return withoutExt.split("/").map(slugifySegment).join("/");
}

async function walkMarkdownFiles(
  dir: string,
  rootDir: string,
  extensions: string[],
  ignoreDirNames: string[],
  errors: LoaderError[],
): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);

    if (dirent.isSymbolicLink()) {
      errors.push({ path: fullPath, reason: "symlink_skipped" });
      continue;
    }

    if (dirent.isDirectory()) {
      if (isIgnoredDir(dirent.name, ignoreDirNames)) continue;
      const nested = await walkMarkdownFiles(
        fullPath,
        rootDir,
        extensions,
        ignoreDirNames,
        errors,
      );
      files.push(...nested);
      continue;
    }

    if (dirent.isFile() && isMarkdownExtension(dirent.name, extensions)) {
      files.push(fullPath);
    }
  }

  return files;
}

export function detectSlugCollisions(files: MarkdownFile[]): LoaderError[] {
  const seenBy = new Map<string, string>();
  const collisions: LoaderError[] = [];

  for (const file of files) {
    const existing = seenBy.get(file.slugCandidate);
    if (existing && existing !== file.relativePath) {
      collisions.push({
        path: file.relativePath,
        reason: "slug_collision",
        detail: `slug "${file.slugCandidate}" also produced by "${existing}"`,
      });
    } else {
      seenBy.set(file.slugCandidate, file.relativePath);
    }
  }

  return collisions;
}

export async function loadPublishedMarkdown(
  options: LoaderOptions = {},
): Promise<LoaderResult> {
  const rootDir = options.rootDir ?? DEFAULT_ROOT_DIR;
  const extensions = options.extensions ?? DEFAULT_EXTENSIONS;
  const ignoreDirNames = options.ignoreDirNames ?? DEFAULT_IGNORE_DIR_NAMES;
  const errors: LoaderError[] = [];

  const rootExists = await fs
    .access(rootDir)
    .then(() => true)
    .catch(() => false);

  if (!rootExists) {
    errors.push({ path: rootDir, reason: "root_not_found" });
    return { files: [], errors };
  }

  const absolutePaths = await walkMarkdownFiles(
    rootDir,
    rootDir,
    extensions,
    ignoreDirNames,
    errors,
  );

  const files: MarkdownFile[] = [];
  for (const absolutePath of absolutePaths) {
    const relativePath = toRelativePath(absolutePath, rootDir);
    try {
      const content = await fs.readFile(absolutePath, "utf8");
      files.push({
        absolutePath,
        relativePath,
        slugCandidate: toSlugCandidate(relativePath),
        content,
      });
    } catch (cause) {
      errors.push({ path: absolutePath, reason: "unreadable", cause });
    }
  }

  errors.push(...detectSlugCollisions(files));

  return { files, errors };
}

async function main() {
  const result = await loadPublishedMarkdown();

  for (const error of result.errors) {
    const detail = error.detail ? ` (${error.detail})` : "";
    console.error(`[content-loader] ${error.reason}: ${error.path}${detail}`);
  }

  console.log(`Found ${result.files.length} markdown files`);
}

const isDirectRun =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  void main();
}
