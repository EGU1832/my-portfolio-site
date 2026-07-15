import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { get } from "@vercel/blob";

export async function requireResumeAuth(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("resume_token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/");
  }
}

export type LoadResumeResult =
  | { ok: true; html: string }
  | { ok: false; message: string };

export async function loadResumeHtml(): Promise<LoadResumeResult> {
  try {
    // Vercel Blob SDK로 프라이빗 HTML 파일을 가져온다.
    // .env.local의 RESUME_HTML_PATH(예: resumes/resume.html)를 사용.
    const result = await get(process.env.RESUME_HTML_PATH!, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result || result.statusCode !== 200) {
      return { ok: false, message: "Failed to load resume: Storage Error" };
    }

    let html = await new Response(result.stream).text();

    // HTML 내 이미지 경로를 안전한 API 주소로 치환
    html = html.replace(
      /src="[^"]+\.(jpg|jpeg|png|webp)"/gi,
      'src="/api/profile-image"'
    );
    html = html.replace(
      /href="[^"]+\.(jpg|jpeg|png|webp)"/gi,
      'href="/api/profile-image"'
    );

    // 프린트 및 다크모드 대비 스타일 주입
    html = html.replace(
      "</head>",
      `
    <style>
      body {
        background: white !important;
        color: black !important;
      }

      h1,h2,h3,h4,h5,h6,
      p,span,li,td,th {
        color: black !important;
      }
    </style>
    </head>
    `
    );

    return { ok: true, html };
  } catch (error) {
    console.error("Resume fetch error:", error);
    return { ok: false, message: "Failed to load resume: Internal Server Error" };
  }
}
