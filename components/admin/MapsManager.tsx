"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MapRow = {
  id: string;
  fileUrl: string;
  caption: string | null;
  source: string | null;
};

export default function MapsManager({
  forecastId,
  initialMaps,
}: {
  forecastId: string;
  initialMaps: MapRow[];
}) {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [source, setSource] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("asMedia", "true");
    fd.append("forecastId", forecastId);
    if (caption) fd.append("caption", caption);
    if (source) fd.append("source", source);
    await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    setCaption("");
    setSource("");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-semibold text-storm-900">Weather Maps</h3>

      <div className="grid gap-2 sm:grid-cols-3">
        <input
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="input"
        />
        <input
          placeholder="Source (e.g. IMD, GFS)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>
      {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}

      {initialMaps.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {initialMaps.map((m) => (
  <div key={m.id} className="overflow-hidden rounded-md border">
    <div className="relative aspect-video">
      <Image
        src={m.fileUrl}
        alt={m.caption || "map"}
        fill
        className="object-cover"
      />

      <button
        type="button"
        onClick={() => {
          // Remove functionality will be connected next
        }}
        className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-2 py-1 text-sm text-white hover:bg-black"
        aria-label="Remove weather map"
      >
        ✕
      </button>
    </div>

    {m.caption && (
      <div className="p-1 text-[11px] text-slate-600">{m.caption}</div>
    )}
  </div>
))}
        </div>
      )}

      <style jsx global>{`
        .input {
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          padding: 0.4rem 0.6rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
