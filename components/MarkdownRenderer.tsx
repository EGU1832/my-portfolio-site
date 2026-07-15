import MarkdownIt from "markdown-it";
import katex from "katex";
import { katex as mdKatex } from "@mdit/plugin-katex";

import { buildBlockTree } from "./markdown/tokenTree";
import { renderBlocks } from "./markdown/render";
import styles from "./MarkdownRenderer.module.css";

import "highlight.js/styles/atom-one-dark.css";
import "katex/dist/katex.min.css";

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  // MarkdownIt
  // NOTE: no `highlight` option here anymore — registry.fence (CodeBlock)
  // intercepts every fence token before md.renderer.render() ever runs,
  // so markdown-it's own default fence rule (which is what calls
  // `options.highlight`) is never reached for the non-math branch below.
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  // KaTeX plugin
  md.use(mdKatex, {
    // **옵션 설정 가능**
    // throwOnError: false,
    // errorColor: "red",
  });

  function normalizeMathEscapes(md: string) {
    return md
      .replace(/\$`([^`]+)`\$/g, (_match, inner) => `$${inner}$`)
      .replace(/\\begin{align}/g, "\\begin{align*}")
      .replace(/\\end{align}/g, "\\end{align*}")
      .replace(/\\ohm\b/g, "\\Omega");
  }
  
  // ChatGPT 스타일 ```math 지원
  const defaultFence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();

    // ChatGPT-style ```math block
    if (info === "math") {
      return katex.renderToString(token.content, {
        throwOnError: false,
        displayMode: true,
      });
    }
    return defaultFence(tokens, idx, options, env, self);
  };

  const processedMarkdown = normalizeMathEscapes(markdown);
  const env = {};
  const tokens = md.parse(processedMarkdown, env);
  const tree = buildBlockTree(tokens);

  return (
    <div className={styles.markdownBody}>
      {renderBlocks(tree, md, md.options, env)}
    </div>
  );
}