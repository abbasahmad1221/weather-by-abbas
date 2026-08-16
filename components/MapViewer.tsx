"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export type MapItem = {
  id: string;
  fileUrl: string;
  caption?: string | null;
  source?: string | null;
  capturedAt?: string | Date | null;
};

export default function MapViewer({ maps }: { maps: MapItem[] }) {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!maps || maps.length === 0) return null;

  const active = fullscreen !== null ? maps[fullscreen] : null;

  return (
    <div className="my-8">
      <h2 className="mb-3 font-display text-xl font-bold text-storm-900">
        Meteorological Maps
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {maps.map((m, i) => (
          <figure
            key={m.id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-storm-950"
          >
            <button
              type="button"
              onClick={() => {
                setFullscreen(i);
                setZoom(1);
              }}
              className="relative block aspect-video w-full"
            >
              <Image
                src={m.fileUrl}
                alt={m.caption || "Weather map"}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain"
              />
              <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-[11px] text-white">
                Click to expand
              </span>
            </button>
            {(m.caption || m.source) && (
              <figcaption className="space-y-0.5 bg-storm-900 px-3 py-2 text-xs text-slate-300">
                {m.caption && <div className="text-slate-100">{m.caption}</div>}
                <div className="flex flex-wrap gap-x-3 text-slate-400">
                  {m.source && <span>Source: {m.source}</span>}
                  {m.capturedAt && <span>{formatDate(m.capturedAt)}</span>}
                </div>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between gap-2 p-3 text-white">
            <div className="text-sm text-slate-300 truncate">
              {active.caption}
              {active.source ? ` · Source: ${active.source}` : ""}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="w-12 text-center text-xs">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                onClick={() => setFullscreen(null)}
                className="rounded bg-amber-500 px-3 py-1 font-semibold text-storm-950 hover:bg-amber-400"
              >
                Close
              </button>
            </div>
          </div>
          <div
            ref={containerRef}
            className="relative flex-1 overflow-auto"
          >
            <div
              className="relative mx-auto"
              style={{
                width: `${zoom * 100}%`,
                transition: "width 0.15s ease",
              }}
            >
              <Image
                src={active.fileUrl}
                alt={active.caption || "Weather map"}
                width={1600}
                height={900}
                sizes="100vw"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
