import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { slug: string } }) {
  const forecast = await prisma.forecast.findUnique({ where: { slug: params.slug } });

  const title = forecast?.title || "Weather by Abbas";
  const region = forecast?.region || "Jammu & Kashmir";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #0a0e1a 0%, #131c33 55%, #1a2540 100%)",
          padding: "64px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px solid #f0a825",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            ☁
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>
            WEATHER <span style={{ color: "#f0a825" }}>BY ABBAS</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 22, color: "#f0a825", fontWeight: 700 }}>
            {region}
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15 }}>
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
