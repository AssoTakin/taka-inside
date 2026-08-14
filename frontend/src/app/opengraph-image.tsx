import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Taka Inside — L'Art au Service de l'Humain";
export const size = { width: 1200, height: 630 };

export default async function Image() {
  let siteName = "Taka Inside";
  let tagline = "L'Art au Service de l'Humain";

  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://taka-inside-production.up.railway.app";
    const token = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const res = await fetch(`${apiUrl}/api/site-config?populate=*`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data;
      const attrs = data?.attributes || data || {};
      const seo = attrs.defaultSeo || {};
      siteName = String(attrs.siteName || siteName);
      tagline = String(seo.metaDescription || attrs.tagline || tagline);
    }
  } catch {
    // Keep defaults
  }

  // Split site name into words; highlight last word in yellow if there are at least 2 words
  const words = siteName.split(/\s+/).filter(Boolean);
  const mainText = words.slice(0, -1).join(" ");
  const highlightedWord = words.length > 1 ? words[words.length - 1] : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#F5F3EF",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {mainText}
          {highlightedWord && <span style={{ color: "#E5B800" }}> {highlightedWord}</span>}
        </div>
        <div style={{ fontSize: 32, marginTop: 20, color: "#A0A0A0" }}>
          {tagline}
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#1B8A3A" }} />
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#E5B800" }} />
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#C41E3A" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
