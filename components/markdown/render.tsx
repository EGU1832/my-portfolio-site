import type { ReactNode } from "react";
import type { BlockNode, MarkdownItInstance, MarkdownItOptions, Token } from "./types";
import { registry } from "./registry";

/**
 * Walks the block tree and dispatches each node to its registered
 * component. Nodes without a registry entry are coalesced, in original
 * token order, into a single markdown-it-rendered HTML chunk — so with an
 * empty registry this reproduces md.render()'s output exactly, just routed
 * through React instead of a raw string mount.
 */
export function renderBlocks(
  nodes: BlockNode[],
  md: MarkdownItInstance,
  options: MarkdownItOptions,
  env: unknown,
): ReactNode[] {
  const output: ReactNode[] = [];
  let pending: Token[] = [];

  const flushPending = () => {
    if (pending.length === 0) return;
    const html = md.renderer.render(pending, options, env);
    output.push(
      <div key={`md-${output.length}`} dangerouslySetInnerHTML={{ __html: html }} />,
    );
    pending = [];
  };

  for (const node of nodes) {
    const Component = registry[node.type];
    if (!Component) {
      pending.push(...node.tokens);
      continue;
    }
    flushPending();
    output.push(
      <Component
        key={`${node.type}-${output.length}`}
        node={node}
        md={md}
        options={options}
        env={env}
      />,
    );
  }
  flushPending();

  return output;
}
