import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

  const imagePath = path.join(
    process.cwd(),
    "assets",
    "resume",
    "Profile-raw.jpg"
  );

  const imageBuffer =
    await fs.readFile(imagePath);

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private",
    },
  });
}