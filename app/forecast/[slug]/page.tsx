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
  const ogImage = forecast.featuredImage ? absoluteUrl(forecast.featuredImage) : undefined;

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
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ForecastPage({ params }: { params: { slug: string } }) {
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
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
    },
    spatialCoverage: {
      "@type": "Place",
      name: forecast.region,
    },
    image: forecast.featuredImage ? absoluteUrl(forecast.featuredImage) : undefined,
    mainEntityOfPage: absoluteUrl(`/forecast/${forecast.slug}`),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Forecasts", item: absoluteUrl("/forecasts") },
      { "@type": "ListItem", position: 3, name: forecast.title, item: absoluteUrl(`/forecast/${forecast.slug}`) },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SeverityBadge severity={forecast.severity} />
        {forecast.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {forecast.category.name}
          </span>
        )}
        {forecast.isSample && (
          <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase text-slate-600">
            Sample content
          </span>
        )}
      </div>

      <h1 className="font-display text-3xl font-extrabold leading-tight text-storm-900 sm:text-4xl">
        {forecast.title}
      </h1>

      <div className="mt-2 text-sm text-slate-500">
        By {forecast.author} · {forecast.publishedAt && formatDate(forecast.publishedAt)} · {forecast.region}
      </div>

      {forecast.featuredImage && (
  <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
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
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover transition duration-300 hover:scale-105"
      />
    </a>
  </div>
)}

      {forecast.advisory && (
        <div className="mt-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="mb-1 font-semibold uppercase tracking-wide">Advisory</div>
          {forecast.advisory}
        </div>
      )}

      <p className="mt-6 text-lg text-slate-700">{forecast.summary}</p>

      <div
        className="prose-forecast mt-4"
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
        <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
          Forecast validity:{" "}
          {forecast.validFrom && formatDate(forecast.validFrom)}
          {forecast.validUntil && ` – ${formatDate(forecast.validUntil)}`}
        </div>
      )}
    </article>
  );
}
