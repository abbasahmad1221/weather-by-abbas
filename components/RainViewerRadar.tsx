 "use client";

export default function RainViewerRadar() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-storm-900">
              🌧️ Live Rain Radar
            </h2>
            <p className="text-sm text-slate-500">
              Recent precipitation activity around Jammu & Kashmir
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            RainViewer
          </span>
        </div>

        <div className="relative h-[520px] w-full bg-slate-100">
          <iframe
            src="https://www.rainviewer.com/map.html?loc=34.0837,74.7973,7&layer=radar&sm=1"
            title="Live Rain Radar for Jammu and Kashmir"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          Weather radar provided by{" "}
          <a
            href="https://www.rainviewer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-600 hover:underline"
          >
            RainViewer
          </a>
        </div>
      </div>
    </section>
  );
}
