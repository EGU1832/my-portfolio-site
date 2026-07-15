import hljs from "highlight.js";
import type { BlockRendererProps } from "../../types";
import CopyButton from "./CopyButton";
import styles from "./CodeBlock.module.css";

export default function CodeBlock({ node, md, options, env }: BlockRendererProps) {
  const token = node.tokens[0];
  const info = token.info.trim();

  // ChatGPT-style ```math fence: still handled entirely by the fence
  // rule override registered in MarkdownRenderer.tsx (katex.renderToString),
  // so just delegate instead of duplicating that logic here.
  if (info === "math") {
    const html = md.renderer.render(node.tokens, options, env);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const lang = info.split(/\s+/)[0] ?? "";
  const highlighted =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(token.content, { language: lang }).value
      : md.utils.escapeHtml(token.content);

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{lang || "text"}</span>
        <CopyButton code={token.content} />
      </div>
      <pre className={styles.pre}>
        <code
          className={`hljs ${styles.code}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
