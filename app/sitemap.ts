import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const forecasts = await prisma.forecast.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "hourly", priority: 1 },
    { url: `${siteConfig.url}/forecasts`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteConfig.url}/archive`, changeFrequency: "daily", priority: 0.6 },
  ];

  const forecastRoutes: MetadataRoute.Sitemap = forecasts.map((f) => ({
    url: `${siteConfig.url}/forecast/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...forecastRoutes];
}
