"use client";

import { useEffect, useState } from "react";

type RadarFrame = {
  time: number;
  path: string;
};

type RadarResponse = {
  generated: number;
  host: string;
  radar: {
    past: RadarFrame[];
  };
};

const LATITUDE = 34.0837;
const LONGITUDE = 74.7973;

export default function RainViewerRadar() {
  const [imageUrl, setImageUrl] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRadar = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://api.rainviewer.com/public/weather-maps.json",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Radar data unavailable");
      }

      const data: RadarResponse = await response.json();
      const frames = data.radar?.past ?? [];
      const latest = frames[frames.length - 1];

      if (!latest) {
        throw new Error("No radar frame available");
      }

      const url = `${data.host}${latest.path}/512/7/${LATITUDE}/${LONGITUDE}/2/1_1.png`;

      setImageUrl(url);

      setUpdatedAt(
        new Date(latest.time * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      setImageUrl("");
      setUpdatedAt("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRadar();

    const interval = setInterval(loadRadar, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-storm-900">
              🌧️ Live Rain Radar
            </h2>
            <p className="text-sm text-slate-500">
              Recent precipitation activity around Jammu &amp; Kashmir
            </p>
          </div>

          {updatedAt && (
            <span className="text-xs font-medium text-slate-500">
              Updated {updatedAt}
            </span>
          )}
        </div>

        <div className="relative aspect-[16/9] bg-slate-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-500">
              Loading radar...
            </div>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Recent rainfall radar around Srinagar and Jammu & Kashmir"
              className="h-full w-full object-cover"
            />
          )}

          {!loading && !imageUrl && (
            <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
              Radar data is temporarily unavailable.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          <span>Radar imagery</span>
          <a
            href="https://www.rainviewer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-600 hover:underline"
          >
            Weather data by RainViewer
          </a>
        </div>
      </div>
    </section>
  );
}
