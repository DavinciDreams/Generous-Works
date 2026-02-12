import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Generous — The Universal Canvas for AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            Generous
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#a0a0b0",
              letterSpacing: "0.5px",
            }}
          >
            Ask for anything.
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: "#6b6b80",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.5,
              marginTop: "16px",
            }}
          >
            The universal canvas for AI. Streaming generative UI with 114+ components.
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "32px",
              fontSize: "14px",
              color: "#4a4a60",
            }}
          >
            <span>Charts</span>
            <span style={{ color: "#2a2a40" }}>|</span>
            <span>3D</span>
            <span style={{ color: "#2a2a40" }}>|</span>
            <span>Maps</span>
            <span style={{ color: "#2a2a40" }}>|</span>
            <span>Editors</span>
            <span style={{ color: "#2a2a40" }}>|</span>
            <span>Games</span>
            <span style={{ color: "#2a2a40" }}>|</span>
            <span>Workflow</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            color: "#4a4a60",
          }}
        >
          <span>generous.works</span>
          <span style={{ color: "#2a2a40" }}>|</span>
          <span>Part of Logos Liber</span>
          <span style={{ color: "#2a2a40" }}>|</span>
          <span>Open Source</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
