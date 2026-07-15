import MarkdownIt from "markdown-it";
import type { ComponentType } from "react";

// Derived via `typeof`/indexed-access instead of the `MarkdownIt.Token`/
// `MarkdownIt.Options` namespace syntax: @types/markdown-it merges a
// const + namespace under one name, and under isolatedModules a
// type-only-looking import of that name can't safely resolve namespace
// member access (TS2702). Indexing off `InstanceType<typeof MarkdownIt>`
// gets the same types without relying on that merge.
type MarkdownItInstance = InstanceType<typeof MarkdownIt>;

export type Token = ReturnType<MarkdownItInstance["parse"]>[number];
export type MarkdownItOptions = MarkdownItInstance["options"];
export type { MarkdownItInstance };

export interface BlockNode {
  /** markdown-it token type with the "_open"/"_close" suffix stripped, or the raw type for self-closing tokens (e.g. "fence", "inline", "hr"). */
  type: string;
  /** The exact contiguous token slice this node spans in the original parse output. */
  tokens: Token[];
  /** Nested block-level children. Built now but unused until a component needs to recurse into its own children. */
  children: BlockNode[];
}

export interface BlockRendererProps {
  node: BlockNode;
  md: MarkdownItInstance;
  options: MarkdownItOptions;
  env: unknown;
}

export type BlockRegistry = Partial<Record<string, ComponentType<BlockRendererProps>>>;
