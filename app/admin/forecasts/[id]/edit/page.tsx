import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ForecastForm from "@/components/admin/ForecastForm";
import MapsManager from "@/components/admin/MapsManager";

export default async function EditForecastPage({ params }: { params: { id: string } }) {
  const [forecast, categories] = await Promise.all([
    prisma.forecast.findUnique({ where: { id: params.id }, include: { maps: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!forecast) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-storm-900">
        Edit Forecast
      </h1>
      <ForecastForm
        categories={categories}
        initial={{
          id: forecast.id,
          title: forecast.title,
          slug: forecast.slug,
          summary: forecast.summary,
          content: forecast.content,
          advisory: forecast.advisory,
          severity: forecast.severity,
          region: forecast.region,
          featuredImage: forecast.featuredImage,
          metaTitle: forecast.metaTitle,
          metaDescription: forecast.metaDescription,
          published: forecast.published,
          categoryId: forecast.categoryId,
          validFrom: forecast.validFrom?.toISOString().slice(0, 10) || "",
          validUntil: forecast.validUntil?.toISOString().slice(0, 10) || "",
        }}
      />

      <div className="mt-8">
        <MapsManager
          forecastId={forecast.id}
          initialMaps={forecast.maps.map((m) => ({
            id: m.id,
            fileUrl: m.fileUrl,
            caption: m.caption,
            source: m.source,
          }))}
        />
      </div>
    </div>
  );
}
