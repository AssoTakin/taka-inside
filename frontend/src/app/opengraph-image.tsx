import { ImageResponse } from "next/og";
import { fetchSiteConfig, extractData } from "@/lib/api";

export const runtime = "edge";
export const alt = "Taka Inside — L'Art au Service de l'Humain";
export const size = { width: 1200, height: 630 };

export default async function Image() {
  const raw = await fetchSiteConfig();
  const config = extractData(raw) || {};
  const seo = config?.defaultSeo as Record<string, unknown> | undefined;

  const siteName = String(config?.siteName || "Taka Inside");
  const tagline = String(seo?.metaDescription || config?.tagline || "L'Art au Service de l'Humain");

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
