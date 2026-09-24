 import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import SeverityBadge from "@/components/SeverityBadge";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Forecast Archive",
  description:
    "Browse the archive of past Jammu & Kashmir weather forecasts by year, month, category and region.",
  alternates: { canonical: "/archive" },
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: {
    year?: string;
    month?: string;
    category?: string;
    region?: string;
  };
}) {
  const forecasts = await prisma.forecast.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const regions = Array.from(
    new Set(forecasts.map((f) => f.region))
  ).sort();

  const years = Array.from(
    new Set(
      forecasts
        .map((f) => f.publishedAt?.getFullYear())
        .filter((year): year is number => Boolean(year))
    )
  ).sort((a, b) => b - a);

  const filtered = forecasts.filter((f) => {
    if (
      searchParams.year &&
      f.publishedAt?.getFullYear().toString() !== searchParams.year
    ) {
      return false;
    }

    if (
      searchParams.month &&
      (f.publishedAt!.getMonth() + 1).toString() !== searchParams.month
    ) {
      return false;
    }

    if (
      searchParams.category &&
      f.category?.slug !== searchParams.category
    ) {
      return false;
    }

    if (searchParams.region && f.region !== searchParams.region) {
      return false;
    }

    return true;
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();

    if (searchParams.year) params.set("year", searchParams.year);
    if (searchParams.month) params.set("month", searchParams.month);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.region) params.set("region", searchParams.region);

    Object.entries(overrides).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const qs = params.toString();
    return qs ? `/archive?${qs}` : "/archive";
  }

  const hasFilters =
    Boolean(searchParams.year) ||
    Boolean(searchParams.month) ||
    Boolean(searchParams.category) ||
    Boolean(searchParams.region);

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
              Forecast Archive
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Explore past Jammu &amp; Kashmir weather forecasts, alerts,
              outlooks and weather analysis.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-sm">
                Historical Forecasts
              </div>

              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300">
                {filtered.length}{" "}
                {filtered.length === 1 ? "result" : "results"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                  Search Archive
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  Filter Forecasts
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Narrow the archive by year, month, category or region.
                </p>
              </div>

              {hasFilters && (
                <Link
                  href="/archive"
                  className="w-fit rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-amber-400 hover:text-amber-600"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            <FilterGroup
              label="Year"
              options={years.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              }))}
              active={searchParams.year}
              buildHref={(value) => buildHref({ year: value })}
            />

            <FilterGroup
              label="Month"
              options={months.map((month, index) => ({
                value: (index + 1).toString(),
                label: month,
              }))}
              active={searchParams.month}
              buildHref={(value) => buildHref({ month: value })}
            />

            <FilterGroup
              label="Category"
              options={categories.map((category) => ({
                value: category.slug,
                label: category.name,
              }))}
              active={searchParams.category}
              buildHref={(value) => buildHref({ category: value })}
            />

            <FilterGroup
              label="Region"
              options={regions.map((region) => ({
                value: region,
                label: region,
              }))}
              active={searchParams.region}
              buildHref={(value) => buildHref({ region: value })}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
              Weather Records
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {hasFilters ? "Filtered Forecasts" : "All Archived Forecasts"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {filtered.length}{" "}
              {filtered.length === 1 ? "forecast" : "forecasts"} found.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              —
            </div>

            <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
              No forecasts found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No archived forecasts match the selected filters.
            </p>

            <Link
              href="/archive"
              className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View all forecasts
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {filtered.map((forecast) => (
                <Link
                  key={forecast.id}
                  href={`/forecast/${forecast.slug}`}
                  className="group block p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={forecast.severity} />

                        {forecast.category && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                            {forecast.category.name}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600 sm:text-xl">
                        {forecast.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span>{forecast.region}</span>
                        <span className="text-slate-300">•</span>
                        <span>
                          {forecast.publishedAt
                            ? formatDate(forecast.publishedAt)
                            : "Draft"}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 transition group-hover:gap-2.5">
                        Read forecast
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function FilterGroup({
  label,
  options,
  active,
  buildHref,
}: {
  label: string;
  options: { value: string; label: string }[];
  active?: string;
  buildHref: (value: string | undefined) => string;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>

      <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
        {options.length === 0 ? (
          <span className="text-xs text-slate-400">No options available</span>
        ) : (
          options.map((option) => (
            <Link
              key={option.value}
              href={buildHref(active === option.value ? undefined : option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active === option.value
                  ? "border-amber-500 bg-amber-500 text-slate-950"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              {option.label}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
