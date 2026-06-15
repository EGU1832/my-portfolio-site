import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.RESUME_PASSWORD) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { role: "resume" },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("resume_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}