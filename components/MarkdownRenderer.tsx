import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import katex from "katex";
import { katex as mdKatex } from "@mdit/plugin-katex";

import "highlight.js/styles/atom-one-dark.css";
import "katex/dist/katex.min.css";

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  // highlight.js
  const highlight = (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
    }
    return `<pre><code class="hljs">${MarkdownIt().utils.escapeHtml(str)}</code></pre>`;
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

  // GitHub RAW 이미지 변환
  const transformImage = (html: string) =>
    html.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
      if (/https?:\/\//i.test(src)) return match;

      let cleaned = src.replace(/^(\.*\/)+/, "");
      if (!cleaned.startsWith("Docs/")) cleaned = `Docs/${cleaned}`;
      cleaned = cleaned.replace(/ /g, "%20");

      const rawURL = `https://raw.githubusercontent.com/EGU1832/archive/main/${cleaned}`;
      return match.replace(src, rawURL);
    });

  let processedMarkdown = normalizeMathEscapes(markdown);
  let html = md.render(processedMarkdown);
  html = transformImage(html);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
