"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SeverityBadge from "@/components/SeverityBadge";

type Row = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  severity: string;
  category: string | null;
  publishedAt: string | null;
  isSample: boolean;
};

export default function ForecastTable({ forecasts }: { forecasts: Row[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function togglePublish(row: Row) {
    setBusyId(row.id);
    await fetch(`/api/forecasts/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !row.published }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(row: Row) {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusyId(row.id);
    await fetch(`/api/forecasts/${row.id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (forecasts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No forecasts yet. Click &ldquo;+ New Forecast&rdquo; to create one.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Published</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {forecasts.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3">
                <div className="font-medium text-storm-900">{row.title}</div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SeverityBadge severity={row.severity} />
                  {row.isSample && <span className="rounded bg-slate-200 px-1.5 py-0.5">Sample</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    row.published ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {row.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{row.category || "—"}</td>
              <td className="px-4 py-3 text-slate-500">
                {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/forecasts/${row.id}/edit`}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busyId === row.id}
                    onClick={() => togglePublish(row)}
                    className="rounded-md border border-amber-400 px-2.5 py-1 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                  >
                    {row.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    disabled={busyId === row.id}
                    onClick={() => remove(row)}
                    className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
