import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ForecastCard from "@/components/ForecastCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Weather Forecasts",
  description:
    "Browse all Jammu & Kashmir weather forecasts, rain alerts, snowfall updates and severe weather warnings.",
  alternates: { canonical: "/forecasts" },
};

export default async function ForecastsPage() {
  const forecasts = await prisma.forecast.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-storm-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              WEATHER BY ABBAS
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              All Weather Forecasts
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Browse the latest Jammu &amp; Kashmir weather forecasts, rain
              alerts, snowfall updates and severe weather warnings.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-sm">
                Jammu &amp; Kashmir
              </div>

              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300">
                Latest first
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {forecasts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
              No forecasts published yet.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New Jammu &amp; Kashmir weather updates will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                  Weather Updates
                </p>

                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Latest Forecasts
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Published weather analysis and outlooks, newest first.
                </p>
              </div>

              <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:block">
                {forecasts.length}{" "}
                {forecasts.length === 1 ? "forecast" : "forecasts"}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {forecasts.map((f) => (
                <ForecastCard key={f.id} forecast={f} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
