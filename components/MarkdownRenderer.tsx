import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import katex from "katex";
import { katex as mdKatex } from "@mdit/plugin-katex";

import "highlight.js/styles/atom-one-dark.css";
import "katex/dist/katex.min.css";

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  // highlight.js
  const highlight = (str: string, lang: string) => {
    const code =
      lang && hljs.getLanguage(lang)
        ? hljs.highlight(str, { language: lang }).value
        : MarkdownIt().utils.escapeHtml(str);
    // Show the fence's language tag even when hljs doesn't recognize it,
    // so the reader always knows what language a code block is.
    const langAttr = lang ? ` data-lang="${MarkdownIt().utils.escapeHtml(lang)}"` : "";
    return `<pre${langAttr}><code class="hljs">${code}</code></pre>`;
  };

  // MarkdownIt
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight,
  });

  // KaTeX plugin
  md.use(mdKatex, {
    // **옵션 설정 가능**
    // throwOnError: false,
    // errorColor: "red",
  });

  function normalizeMathEscapes(md: string) {
    return md.replace(/\$`([^`]+)`\$/g, (_match, inner) => `$${inner}$`);
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

  let processedMarkdown = normalizeMathEscapes(markdown);
  let html = md.render(processedMarkdown);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
