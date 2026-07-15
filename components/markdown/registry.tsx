import type { BlockRegistry } from "./types";
import CodeBlock from "./blocks/CodeBlock/CodeBlock";

/**
 * token.type -> Component. Adding a feature (Image, Table, ...) later
 * means adding one entry here plus its component file — nothing else in
 * the pipeline changes. Unregistered types keep falling back to
 * markdown-it's own rendering in render.tsx.
 */
export const registry: BlockRegistry = {
  fence: CodeBlock,
};
