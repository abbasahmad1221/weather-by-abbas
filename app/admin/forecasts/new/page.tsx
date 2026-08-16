import { prisma } from "@/lib/prisma";
import ForecastForm from "@/components/admin/ForecastForm";

export default async function NewForecastPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-storm-900">
        New Forecast
      </h1>
      <ForecastForm categories={categories} />
      <p className="mt-4 text-xs text-slate-500">
        Weather map images can be added once the forecast is saved — open it
        again from the dashboard to attach maps.
      </p>
    </div>
  );
}
