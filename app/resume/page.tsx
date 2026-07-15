// app/resume/page.tsx
import { requireResumeAuth, loadResumeHtml } from "./loadResumeHtml";

export default async function ResumePage() {
  await requireResumeAuth();

  const result = await loadResumeHtml();
  if (!result.ok) {
    return <div>{result.message}</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: result.html }} />;
}
