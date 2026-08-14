import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const alt = "Taka Inside — L'Art au Service de l'Humain";
export const size = { width: 1200, height: 630 };

export default function Image() {
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
          Taka <span style={{ color: "#E5B800" }}>Inside</span>
        </div>
        <div style={{ fontSize: 32, marginTop: 20, color: "#A0A0A0" }}>
          L'Art au Service de l'Humain
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
