import { get } from "@vercel/blob";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {

  const cookieStore = await cookies();

  const token =
    cookieStore.get("resume_token")?.value;

  if (!token) {
    return new NextResponse(
      "Unauthorized",
      { status: 401 }
    );
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
  } catch {
    return new NextResponse(
      "Unauthorized",
      { status: 401 }
    );
  }

  const result = await get(
    process.env.RESUME_PATH!,
    {
      access: "private",
    }
  );

  if (!result || result.statusCode !== 200) {
    return new NextResponse(
      "Not Found",
      { status: 404 }
    );
  }

  return new NextResponse(
    result.stream,
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control":
          "private, no-cache",
      },
    }
  );
}