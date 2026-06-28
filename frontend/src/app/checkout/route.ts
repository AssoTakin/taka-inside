import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

export async function GET() {
  const htmlPath = process.cwd() + "/public/checkout.html";
  let html = await readFile(htmlPath, "utf-8");

  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";
  html = html.replace(
    "window.GOOGLE_PLACES_API_KEY || '';",
    `window.GOOGLE_PLACES_API_KEY || '${key.replace(/'/g, "\\'")}';`
  );

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
