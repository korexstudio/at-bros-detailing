import { ImageResponse } from "next/og";
import { business } from "@/content";

export const alt = `${business.name} — mobile & drop-off car detailing in the 626`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "linear-gradient(135deg, #0b0b0d 0%, #1b1b20 100%)",
          color: "#ececec",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#c9a96a",
          }}
        >
          AT Bros Detailing
        </div>
        <div style={{ fontSize: 72, marginTop: 20, lineHeight: 1.1 }}>
          Your car, the way it left the showroom.
        </div>
        <div style={{ fontSize: 32, marginTop: 28, color: "#a3a3ab" }}>
          {`Mobile & drop-off · San Gabriel Valley · ${business.phoneDisplay}`}
        </div>
      </div>
    ),
    size,
  );
}
