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

export default function ForecastCard({
  forecast,
  priority,
}: {
  forecast: ForecastCardData;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-storm-900">
        {forecast.featuredImage ? (
          <a
            href={forecast.featuredImage}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${forecast.title} featured image full size`}
            className="block h-full w-full"
          >
            <Image
              src={forecast.featuredImage}
              alt={forecast.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </a>
        ) : (
          <div className="flex h-full items-center justify-center bg-storm-gradient text-sm text-slate-400">
            No image
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />

        {forecast.isSample && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            Sample
          </span>
        )}

        {forecast.category && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-[10px] font-semibold text-slate-200 backdrop-blur">
            {forecast.category.name}
          </span>
        )}
      </div>

      <Link
        href={`/forecast/${forecast.slug}`}
        className="flex flex-1 flex-col p-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={forecast.severity} />
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600">
          {forecast.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {forecast.summary}
        </p>

        <div className="mt-auto border-t border-slate-100 pt-4 mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-medium text-slate-400">
              {forecast.publishedAt
                ? formatDate(forecast.publishedAt)
                : "Draft"}
            </span>

            <span className="font-semibold text-slate-500">
              {forecast.region}
            </span>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 transition group-hover:gap-2.5">
            Read forecast
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
