import { prisma } from "@/lib/prisma";
import ForecastTable from "@/components/admin/ForecastTable";
export const dynamic = "force-dynamic";
export default async function AdminDashboard() {
  const forecasts = await prisma.forecast.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const stats = {
    total: forecasts.length,
    published: forecasts.filter((f) => f.published).length,
    drafts: forecasts.filter((f) => !f.published).length,
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-storm-900">Dashboard</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Drafts" value={stats.drafts} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-storm-900">
          All Forecasts
        </h2>
        <ForecastTable
          forecasts={forecasts.map((f) => ({
            id: f.id,
            title: f.title,
            slug: f.slug,
            published: f.published,
            severity: f.severity,
            category: f.category?.name || null,
            publishedAt: f.publishedAt?.toISOString() || null,
            isSample: f.isSample,
          }))}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-2xl font-bold text-storm-900">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
