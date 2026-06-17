// app/profile-image/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { get } from "@vercel/blob";

export async function GET() {
  // 1. 쿠키에서 JWT 토큰 가져오기 및 인증
  const cookieStore = await cookies();
  const token = cookieStore.get("resume_token")?.value;

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 2. 환경 변수에 저장된 경로로 Private Blob 조회
    // .env.local에 BLOB_READ_WRITE_TOKEN이 있으면 자동으로 인증됩니다.
    const result = await get(process.env.PROFILE_IMAGE_PATH!, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Vercel Blob에서 파일을 찾지 못했거나 오류가 발생한 경우 처리
    if (!result || result.statusCode !== 200) {
      return new NextResponse("Profile image not found", { status: 404 });
    }

    // 3. 효율적인 스트림 방식으로 파일 반환 및 보안/캐시 헤더 추가
    return new NextResponse(result.stream, {
      headers: {
        // 하드코딩 대신 Blob이 가진 원래의 Content-Type 사용 (jpeg, png 모두 대응 가능)
        "Content-Type": result.blob.contentType, 
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, max-age=3600", // 브라우저 개인 캐시 허용 (1시간)
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}