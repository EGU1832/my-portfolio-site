// app/api/hero-image/route.ts
import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

// 메인 페이지 히어로 영역용 프로필 사진.
// SITE_MODE=resume 배포에서만 노출되며, 그 외에는 항상 404 처리된다.
export async function GET() {
  if (process.env.SITE_MODE !== "resume") {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const result = await get(process.env.PROFILE_IMAGE_PATH!, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result || result.statusCode !== 200) {
      return new NextResponse("Profile image not found", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
