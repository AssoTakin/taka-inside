import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "taka-preview";
const COOKIE_VALUE = "taka2026";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correctPassword = process.env.PREVIEW_PASSWORD || "taka2026";

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
}
