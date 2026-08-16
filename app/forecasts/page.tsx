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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-2xl font-extrabold text-storm-900 sm:text-3xl">
        All Forecasts
      </h1>
      <p className="mt-1 text-slate-600">
        Every published weather forecast for Jammu &amp; Kashmir, newest first.
      </p>

      {forecasts.length === 0 ? (
        <p className="mt-8 text-slate-500">No forecasts published yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {forecasts.map((f) => (
            <ForecastCard key={f.id} forecast={f} />
          ))}
        </div>
      )}
    </div>
  );
}
