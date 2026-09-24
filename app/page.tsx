 import LiveWeather from "@/components/LiveWeather";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import ForecastCard from "@/components/ForecastCard";
import SeverityBadge from "@/components/SeverityBadge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kashmir Weather Today | Jammu & Kashmir Weather Forecast",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const latest = await prisma.forecast.findFirst({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  const recent = await prisma.forecast.findMany({
    where: {
      published: true,
      NOT: latest ? { id: latest.id } : undefined,
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: { category: true },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-storm-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.9),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Weather By Abbas"
                width={58}
                height={58}
                className="rounded-full border border-white/20 object-cover"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Weather By Abbas
                </p>
                <p className="text-xs text-slate-400">
                  Jammu & Kashmir Weather
                </p>
              </div>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Kashmir Weather Today
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Latest Jammu & Kashmir weather updates, forecasts, alerts and
              weather analysis.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Latest Update
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-storm-900 sm:text-3xl">
              Latest Weather Update
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              The most recently published weather forecast from Weather By Abbas.
            </p>
          </div>

          <Link
            href="/forecasts"
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            View all forecasts →
          </Link>
        </div>

        {latest ? (
          <Link
            href={`/forecast/${latest.slug}`}
            className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="grid lg:grid-cols-[1.05fr_1fr]">
              <div className="relative min-h-[240px] overflow-hidden bg-slate-200 sm:min-h-[300px] lg:min-h-[360px]">
                {latest.featuredImage ? (
                  <Image
                    src={latest.featuredImage}
                    alt={latest.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-sky-950">
                    <div className="text-center">
                      <p className="font-display text-4xl font-bold text-white">
                        WEATHER
                      </p>
                      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-sky-300">
                        Jammu & Kashmir
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  <SeverityBadge severity={latest.severity} />
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                  <span>{latest.category?.name || "Weather Forecast"}</span>
                  <span className="text-slate-300">•</span>
                  <span>Latest Update</span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-storm-900 transition group-hover:text-sky-700 sm:text-3xl">
                  {latest.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {latest.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  {latest.publishedAt && (
                    <span>{formatDate(latest.publishedAt)}</span>
                  )}
                  <span>{latest.region}</span>
                </div>

                <div className="mt-7 text-sm font-semibold text-sky-700">
                  Read full weather update →
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No weather forecast has been published yet.
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                Live Conditions
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-storm-900">
                Srinagar Weather
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Current weather conditions and observations.
              </p>
            </div>

            <Link
              href="/weather"
              className="text-sm font-semibold text-sky-700 hover:text-sky-800"
            >
              Full weather →
            </Link>
          </div>

          <div className="mt-6">
          <LiveWeather
  latitude={34.0837}
  longitude={74.7973}
  locationName="Srinagar, Jammu & Kashmir"
/>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Weather By Abbas
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-storm-900">
              Recent Forecasts
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Recent Jammu & Kashmir weather forecasts and analysis.
            </p>
          </div>

          <Link
            href="/archive"
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            Browse archive →
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((forecast) => (
              <ForecastCard
                key={forecast.id}
                forecast={{
                  id: forecast.id,
                  title: forecast.title,
                  slug: forecast.slug,
                  summary: forecast.summary,
                  severity: forecast.severity,
                  region: forecast.region,
                  featuredImage: forecast.featuredImage,
                  publishedAt: forecast.publishedAt,
                  category: forecast.category,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No recent forecasts available.
          </div>
        )}
      </section>

      <section className="bg-storm-950">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Jammu & Kashmir Weather
          </p>

          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
            Kashmir Weather Forecast and Updates
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Weather By Abbas provides Jammu & Kashmir weather forecasts,
            current conditions, weather alerts and regional analysis covering
            Jammu, Kashmir Valley, Pir Panjal and surrounding areas.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/weather"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-storm-900 transition hover:bg-slate-100"
            >
              Live Weather
            </Link>

            <Link
              href="/forecasts"
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Forecasts
            </Link>

            <Link
              href="/archive"
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Archive
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            Weather By Abbas — Jammu & Kashmir weather forecasts, alerts and
            analysis.
          </p>
        </div>
      </section>
    </main>
  );
}
