import { ImageResponse } from "next/og";
import {
  business,
  sellableServices,
  serviceBySlug,
  startingPrice,
} from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return sellableServices.map((s) => ({ slug: s.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = serviceBySlug((await params).slug);
  const name = service?.name ?? business.name;
  const price = service
    ? `from ${startingPrice(service)} · ${service.duration.label}`
    : "";

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
          AT Bros Detailing · the 626
        </div>
        <div style={{ fontSize: 84, marginTop: 20, lineHeight: 1.05 }}>{name}</div>
        {price ? (
          <div style={{ fontSize: 36, marginTop: 24, color: "#c9a96a" }}>
            {price}
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
