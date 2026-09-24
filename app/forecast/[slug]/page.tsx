 import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import SeverityBadge from "@/components/SeverityBadge";
import MapViewer from "@/components/MapViewer";

export const revalidate = 60;

async function getForecast(slug: string) {
  return prisma.forecast.findUnique({
    where: { slug },
    include: { category: true, maps: true },
  });
}

export async function generateStaticParams() {
  const forecasts = await prisma.forecast.findMany({
    where: { published: true },
    select: { slug: true },
    take: 50,
  });

  return forecasts.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const forecast = await getForecast(params.slug);

  if (!forecast) return {};

  const title = forecast.metaTitle || forecast.title;
  const description = forecast.metaDescription || forecast.summary;
  const url = absoluteUrl(`/forecast/${forecast.slug}`);
  const ogImage = forecast.featuredImage
    ? absoluteUrl(forecast.featuredImage)
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: forecast.publishedAt?.toISOString(),
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ForecastPage({
  params,
}: {
  params: { slug: string };
}) {
  const forecast = await getForecast(params.slug);

  if (!forecast || !forecast.published) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WeatherForecast",
    name: forecast.title,
    description: forecast.summary,
    datePublished: forecast.publishedAt?.toISOString(),
    dateModified: forecast.updatedAt.toISOString(),
    author: { "@type": "Person", name: forecast.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logo),
      },
    },
    spatialCoverage: {
      "@type": "Place",
      name: forecast.region,
    },
    image: forecast.featuredImage
      ? absoluteUrl(forecast.featuredImage)
      : undefined,
    mainEntityOfPage: absoluteUrl(`/forecast/${forecast.slug}`),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Forecasts",
        item: absoluteUrl("/forecasts"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: forecast.title,
        item: absoluteUrl(`/forecast/${forecast.slug}`),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbLd),
          }}
        />

        <section className="relative overflow-hidden bg-storm-gradient">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_35%)]" />

          <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={forecast.severity} />

              {forecast.category && (
                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {forecast.category.name}
                </span>
              )}

              {forecast.isSample && (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                  Sample content
                </span>
              )}
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              WEATHER BY ABBAS
            </p>

            <h1 className="mt-2 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {forecast.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300">
              <span>By {forecast.author}</span>
              <span className="text-slate-600">•</span>

              {forecast.publishedAt && (
                <span>{formatDate(forecast.publishedAt)}</span>
              )}

              <span className="text-slate-600">•</span>
              <span>{forecast.region}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            {forecast.featuredImage && (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-storm-900">
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
                    priority
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                  />
                </a>
              </div>
            )}

            <div className="p-5 sm:p-8 lg:p-10">
              {forecast.advisory && (
                <div className="mb-7 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
                  <div className="border-b border-amber-200 bg-amber-100/60 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                      Advisory
                    </p>
                  </div>

                  <div className="px-4 py-4 text-sm leading-7 text-amber-900 sm:px-5">
                    {forecast.advisory}
                  </div>
                </div>
              )}

              <p className="rounded-2xl bg-slate-50 p-5 text-base font-medium leading-7 text-slate-700 sm:p-6 sm:text-lg">
                {forecast.summary}
              </p>

              <div
                className="prose-forecast mt-8"
                dangerouslySetInnerHTML={{ __html: forecast.content }}
              />

              <MapViewer
                maps={forecast.maps.map((m) => ({
                  id: m.id,
                  fileUrl: m.fileUrl,
                  caption: m.caption,
                  source: m.source,
                  capturedAt: m.capturedAt,
                }))}
              />

              {(forecast.validFrom || forecast.validUntil) && (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
                    Forecast Validity
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {forecast.validFrom && formatDate(forecast.validFrom)}
                    {forecast.validUntil &&
                      ` – ${formatDate(forecast.validUntil)}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
