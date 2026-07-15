import type { BlockNode, Token } from "./types";

/**
 * Reconstructs markdown-it's flat Token[] (open/close pairs) into a nested
 * tree via a stack reducer keyed on token.nesting. Nothing in the render
 * path consumes `children` yet — see render.tsx — but future block
 * components (Blockquote, List, ...) need real nesting to recurse into,
 * not the flat array markdown-it hands back.
 */
export function buildBlockTree(tokens: Token[]): BlockNode[] {
  const root: BlockNode[] = [];
  const stack: Array<{ type: string; startIndex: number; children: BlockNode[] }> = [
    { type: "__root__", startIndex: -1, children: root },
  ];

  tokens.forEach((token, index) => {
    if (token.nesting === 1) {
      stack.push({
        type: token.type.replace(/_open$/, ""),
        startIndex: index,
        children: [],
      });
      return;
    }

    if (token.nesting === -1) {
      const frame = stack.pop();
      if (!frame) return;
      const parent = stack[stack.length - 1];
      parent.children.push({
        type: frame.type,
        tokens: tokens.slice(frame.startIndex, index + 1),
        children: frame.children,
      });
      return;
    }

    stack[stack.length - 1].children.push({
      type: token.type,
      tokens: [token],
      children: [],
    });
  });

  return root;
}
