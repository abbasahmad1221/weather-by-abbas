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
    where: { published: true, NOT: latest ? { id: latest.id } : undefined },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: { category: true },
  });

  return (
    <div>
      {/* Hero / latest forecast */}
      <section className="bg-storm-gradient">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-amber-500 sm:h-20 sm:w-20">
              <Image src="/logo.jpg" alt={siteConfig.name} fill sizes="80px" className="object-cover" priority />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                Kashmir Weather Today
              </h1>
              <p className="text-sm text-slate-400">
                Latest Jammu &amp; Kashmir weather forecast, updated regularly by {siteConfig.handle}
              </p>
            </div>
          </div>

          {latest ? (
            <Link
              href={`/forecast/${latest.slug}`}
              className="group grid gap-6 overflow-hidden rounded-2xl border border-storm-700 bg-storm-900/60 shadow-xl md:grid-cols-2"
            >
              <div className="relative aspect-[16/9] md:aspect-auto md:h-full">
                {latest.featuredImage ? (
                  <Image
                    src={latest.featuredImage}
                    alt={latest.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    No image
                  </div>
                )}
                {latest.isSample && (
                  <span className="absolute left-3 top-3 rounded bg-slate-900/80 px-2 py-1 text-[11px] font-semibold uppercase text-white">
                    Sample content
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={latest.severity} />
                  {latest.category && (
                    <span className="text-xs font-medium text-amber-400">
                      {latest.category.name}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {latest.title}
                </h2>
                <p className="text-slate-300">{latest.summary}</p>
                <div className="text-xs text-slate-500">
                  {latest.publishedAt && formatDate(latest.publishedAt)} · {latest.region}
                </div>
                <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-storm-950 transition group-hover:bg-amber-400">
                  Read full forecast →
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-storm-700 bg-storm-900/60 p-10 text-center text-slate-400">
              No forecast has been published yet. Log in to the admin dashboard to
              publish your first forecast.
            </div>
          )}
        </div>
      </section>

      {/* Recent forecasts grid */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-storm-900">
              Recent Forecasts
            </h2>
            <Link href="/forecasts" className="text-sm font-semibold text-amber-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((f) => (
              <ForecastCard key={f.id} forecast={f} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
