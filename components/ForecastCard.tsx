import Link from "next/link";
import Image from "next/image";
import SeverityBadge from "./SeverityBadge";
import { formatDate } from "@/lib/utils";

export type ForecastCardData = {
  slug: string;
  title: string;
  summary: string;
  featuredImage?: string | null;
  severity: string;
  region: string;
  publishedAt?: Date | string | null;
  category?: { name: string; slug: string } | null;
  isSample?: boolean;
};

export default function ForecastCard({ forecast, priority }: { forecast: ForecastCardData; priority?: boolean }) {
  return (
    <Link
      href={`/forecast/${forecast.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-storm-900">
        {forecast.featuredImage ? (
          <Image
            src={forecast.featuredImage}
            alt={forecast.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            No image
          </div>
        )}
        {forecast.isSample && (
          <span className="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
            Sample
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={forecast.severity} />
          {forecast.category && (
            <span className="text-xs font-medium text-slate-500">
              {forecast.category.name}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-storm-900 group-hover:text-amber-600">
          {forecast.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600">{forecast.summary}</p>
        <div className="mt-auto pt-2 text-xs text-slate-400">
          {forecast.publishedAt ? formatDate(forecast.publishedAt) : "Draft"} · {forecast.region}
        </div>
      </div>
    </Link>
  );
}
