import MarkdownIt from "markdown-it";
import mathjax3 from "markdown-it-mathjax3";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

// MathJax script loader
function loadMathJax() {
  if (typeof window === "undefined") return;

  if (!document.getElementById("mathjax-script")) {
    const script = document.createElement("script");
    script.id = "mathjax-script";
    script.async = true;
    script.src =
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    document.head.appendChild(script);
  }
}

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  // highlight.js hook
  const highlight = (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
    }
    return `<pre><code class="hljs">${MarkdownIt().utils.escapeHtml(str)}</code></pre>`;
  };

  // MarkdownIt initialization
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight,
  }).use(mathjax3);

  // Handle ```math blocks like ChatGPT
  const defaultFence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];

    if (token.info.trim() === "math") {
      return `<div class="math-display">\\[\n${token.content}\n\\]</div>`;
    }
    return defaultFence(tokens, idx, options, env, self);
  };

  // Convert Docs/img → GitHub RAW URLs
  const transformImage = (html: string) =>
    html.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
      if (/https?:\/\//i.test(src)) return match;

      let cleaned = src.replace(/^(\.*\/)+/, "");
      if (!cleaned.startsWith("Docs/")) cleaned = `Docs/${cleaned}`;
      cleaned = cleaned.replace(/ /g, "%20");

      const rawURL = `https://raw.githubusercontent.com/EGU1832/archive/main/${cleaned}`;
      return match.replace(src, rawURL);
    });

  // Render Markdown
  let html = md.render(markdown);
  html = transformImage(html);

  // MathJax typeset
  if (typeof window !== "undefined") {
    loadMathJax();
    setTimeout(() => {
      const mj = (window as any).MathJax;
      if (mj?.typesetPromise) mj.typesetPromise();
    }, 30);
  }

  return (
    <div
      className="markdown-body" // ← ChatGPT 스타일을 적용하는 핵심
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
