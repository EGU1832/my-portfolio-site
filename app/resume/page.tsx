// app/resume/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { get } from "@vercel/blob"; // Vercel Blob SDK 추가

export default async function ResumePage() {
  // 1. 쿠키 및 JWT 인증 (유효하지 않으면 홈으로 리다이렉트)
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

  let html = "";

  try {
    // 2. 외부 fetch 대신 Private Blob SDK를 사용하여 HTML 파일 가져오기
    // .env.local의 RESUME_HTML_PATH(예: resumes/resume.html)를 사용합니다.
    const result = await get(process.env.RESUME_HTML_PATH!, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result || result.statusCode !== 200) {
      return <div>Failed to load resume: Storage Error</div>;
    }

    const blobStream = (result.stream || (result as any).body) as ReadableStream;

    const responseProxy = new Response(blobStream);
    html = await responseProxy.text();

  } catch (error) {
    console.error("Resume fetch error:", error);
    return <div>Failed to load resume: Internal Server Error</div>;
  }

  // 4. HTML 내의 모든 이미지 경로를 우리가 만든 안전한 API 주소로 치환
  // 정규식을 통해 기존에 노출되어 있던 파일 주소들을 모두 '/api/profile-image'로 변경합니다.
  html = html.replace(
    /src="[^"]+\.(jpg|jpeg|png|webp)"/gi,
    'src="/api/profile-image"'
  );

  html = html.replace(
    /href="[^"]+\.(jpg|jpeg|png|webp)"/gi,
    'href="/api/profile-image"'
  );

  // 5. 프린트 및 다크모드 대비 스타일 주입
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

  // 6. 안전하게 처리된 HTML을 화면에 렌더링
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}