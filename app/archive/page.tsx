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
  searchParams: { year?: string; month?: string; category?: string; region?: string };
}) {
  const forecasts = await prisma.forecast.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const regions = Array.from(new Set(forecasts.map((f) => f.region))).sort();
  const years = Array.from(
    new Set(forecasts.map((f) => f.publishedAt?.getFullYear()).filter(Boolean))
  ).sort((a, b) => (b as number) - (a as number));

  const filtered = forecasts.filter((f) => {
    if (searchParams.year && f.publishedAt?.getFullYear().toString() !== searchParams.year) return false;
    if (
      searchParams.month &&
      (f.publishedAt!.getMonth() + 1).toString() !== searchParams.month
    )
      return false;
    if (searchParams.category && f.category?.slug !== searchParams.category) return false;
    if (searchParams.region && f.region !== searchParams.region) return false;
    return true;
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams({
      ...(searchParams as Record<string, string>),
      ...overrides,
    } as Record<string, string>);
    Object.keys(overrides).forEach((k) => {
      if (!overrides[k]) params.delete(k);
    });
    const qs = params.toString();
    return qs ? `/archive?${qs}` : "/archive";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-2xl font-extrabold text-storm-900 sm:text-3xl">
        Forecast Archive
      </h1>
      <p className="mt-1 text-slate-600">
        Filter past forecasts by year, month, category or region.
      </p>

      {/* Filters as links for server-rendered simplicity */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <FilterGroup
          label="Year"
          options={years.map((y) => ({ value: y!.toString(), label: y!.toString() }))}
          active={searchParams.year}
          buildHref={(v) => buildHref({ year: v })}
        />
        <FilterGroup
          label="Month"
          options={months.map((m, i) => ({ value: (i + 1).toString(), label: m }))}
          active={searchParams.month}
          buildHref={(v) => buildHref({ month: v })}
        />
        <FilterGroup
          label="Category"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          active={searchParams.category}
          buildHref={(v) => buildHref({ category: v })}
        />
        <FilterGroup
          label="Region"
          options={regions.map((r) => ({ value: r, label: r }))}
          active={searchParams.region}
          buildHref={(v) => buildHref({ region: v })}
        />
      </div>

      {(searchParams.year || searchParams.month || searchParams.category || searchParams.region) && (
        <Link href="/archive" className="mt-3 inline-block text-sm text-amber-600 hover:underline">
          Clear filters
        </Link>
      )}

      <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {filtered.length === 0 && (
          <p className="p-6 text-slate-500">No forecasts match these filters.</p>
        )}
        {filtered.map((f) => (
          <Link
            key={f.id}
            href={`/forecast/${f.slug}`}
            className="flex flex-col gap-1 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={f.severity} />
                <span className="font-semibold text-storm-900">{f.title}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {f.category?.name} · {f.region}
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {f.publishedAt && formatDate(f.publishedAt)}
            </div>
          </Link>
        ))}
      </div>
    </div>
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
  buildHref: (v: string | undefined) => string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Link
            key={o.value}
            href={buildHref(active === o.value ? undefined : o.value)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              active === o.value
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-slate-300 text-slate-600 hover:border-amber-400"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
