 import LiveWeather from "@/components/LiveWeather";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import ForecastCard from "@/components/ForecastCard";
import SeverityBadge from "@/components/SeverityBadge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kashmir Weather Today | Jammu & Kashmir Weather Forecast",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

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
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-storm-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-16 sm:w-16">
              <Image
                src="/logo.jpg"
                alt={siteConfig.name}
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Weather By Abbas
              </p>

              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                Kashmir Weather Today
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-300 sm:text-base">
                Latest Jammu &amp; Kashmir weather forecasts, alerts and weather
                analysis.
              </p>
            </div>
          </div>

          {latest ? (
            <Link
              href={`/forecast/${latest.slug}`}
              className="group block overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 shadow-2xl backdrop-blur-sm transition duration-300 hover:border-amber-400/30 hover:shadow-amber-950/20"
            >
              <div className="grid lg:grid-cols-[1.15fr_1fr]">
                <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[390px]">
                  {latest.featuredImage ? (
                    <Image
                      src={latest.featuredImage}
                      alt={latest.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-[260px] items-center justify-center bg-slate-900 text-slate-500">
                      No image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {latest.isSample && (
                    <span className="absolute left-5 top-5 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                      Sample content
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={latest.severity} />

                    {latest.category && (
                      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                        {latest.category.name}
                      </span>
                    )}
                  </div>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Latest Forecast
                  </p>

                  <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {latest.title}
                  </h2>

                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-300 sm:text-base">
                    {latest.summary}
                  </p>

                  <div className="mt-5 text-xs text-slate-400">
                    {latest.publishedAt && formatDate(latest.publishedAt)}{" "}
                    <span className="mx-1 text-slate-600">•</span>{" "}
                    {latest.region}
                  </div>

                  <div className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition group-hover:bg-amber-400">
                    Read full forecast
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-10 text-center text-slate-400">
              No forecast has been published yet.
            </div>
          )}
        </div>
      </section>

      <section className="relative -mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                  Live Conditions
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  Kashmir Weather Now
                </h2>
              </div>

              <Link
                href="/weather"
                className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 sm:text-sm"
              >
                Full weather →
              </Link>
            </div>
          </div>

          <LiveWeather
            latitude={34.0837}
            longitude={74.7973}
            locationName="Srinagar, Jammu & Kashmir"
          />
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                Weather Updates
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Recent Forecasts
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Latest weather analysis, outlooks and updates for Jammu &amp;
                Kashmir.
              </p>
            </div>

            <Link
              href="/forecasts"
              className="hidden shrink-0 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((f) => (
              <ForecastCard key={f.id} forecast={f} />
            ))}
          </div>

          <div className="mt-7 text-center sm:hidden">
            <Link
              href="/forecasts"
              className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              View all forecasts →
            </Link>
          </div>
        </section>
      )}

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
              Jammu &amp; Kashmir Weather
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Kashmir Weather Forecast and Updates
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Weather By Abbas provides weather forecasts, live weather
                conditions, alerts and weather analysis with a special focus on
                Jammu &amp; Kashmir. The platform covers weather developments
                across the Kashmir Valley, Jammu region, Pir Panjal and other
                parts of the region.
              </p>

              <p>
                Weather updates may include rainfall, thunderstorms,
                temperature changes, snowfall, changing atmospheric conditions
                and significant weather systems affecting Jammu &amp; Kashmir.
                Forecast information is presented in a simple format to make
                developing weather conditions easier to understand.
              </p>

              <p>
                For current conditions, visit the{" "}
                <Link
                  href="/weather"
                  className="font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Jammu &amp; Kashmir live weather
                </Link>{" "}
                page. To read the latest outlooks and weather analysis, browse
                the{" "}
                <Link
                  href="/forecasts"
                  className="font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  latest Kashmir weather forecasts
                </Link>
                . Previous forecasts can be explored through the{" "}
                <Link
                  href="/archive"
                  className="font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  weather forecast archive
                </Link>
                .
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/weather"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Live Weather →
              </Link>

              <Link
                href="/forecasts"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600"
              >
                Latest Forecasts →
              </Link>

              <Link
                href="/archive"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600"
              >
                Forecast Archive →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            WEATHER BY ABBAS
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Independent meteorological forecasts and weather analysis for
            Jammu &amp; Kashmir.
          </p>
        </div>
      </section>
    </div>
  );
}
