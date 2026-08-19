"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { makeSlug, slugDatePart } from "@/lib/utils";

export type Category = { id: string; name: string };

export type ForecastFormData = {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  advisory?: string | null;
  severity: string;
  region: string;
  featuredImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  published: boolean;
  categoryId?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
};

export default function ForecastForm({
  initial,
  categories,
}: {
  initial?: ForecastFormData;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState<ForecastFormData>(
    initial || {
      title: "",
      summary: "",
      content: "",
      advisory: "",
      severity: "normal",
      region: "Jammu & Kashmir",
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      published: false,
      categoryId: "",
      validFrom: "",
      validUntil: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ForecastFormData>(key: K, value: ForecastFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) update("featuredImage", data.fileUrl);
    else setError(data.error || "Upload failed");
  }

  async function handleSubmit(e: React.FormEvent, publishOverride?: boolean) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      published: publishOverride ?? form.published,
      slug: form.slug || makeSlug(form.title, slugDatePart(new Date())),
    };

    const res = await fetch(isEdit ? `/api/forecasts/${initial!.id}` : "/api/forecasts", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
  setError(
    typeof data.error === "string"
      ? data.error
      : JSON.stringify(data.error)
  );
  return;
}

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Title">
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="URL slug (leave blank to auto-generate)">
        <input
          value={form.slug || ""}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="jammu-kashmir-weather-forecast-13-august-2026"
          className="input"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Severity">
          <select
            value={form.severity}
            onChange={(e) => update("severity", e.target.value)}
            className="input"
          >
            <option value="normal">Normal Forecast</option>
            <option value="watch">Weather Watch</option>
            <option value="warning">Weather Warning</option>
            <option value="alert">Severe Alert</option>
          </select>
        </Field>
        <Field label="Region">
          <input
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          value={form.categoryId || ""}
          onChange={(e) => update("categoryId", e.target.value)}
          className="input"
        >
          <option value="">— None —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Summary (shown in cards, meta description fallback)">
        <textarea
          required
          rows={3}
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Advisory (optional alert box)">
        <textarea
          rows={2}
          value={form.advisory || ""}
          onChange={(e) => update("advisory", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Full forecast content (HTML supported)">
        <textarea
          required
          rows={12}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className="input font-mono text-sm"
        />
      </Field>

      <Field label="Featured image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
        />
        {uploading && <p className="text-xs text-slate-500">Uploading…</p>}
       {form.featuredImage && (
  <div className="relative mt-2 h-40 w-full max-w-sm overflow-hidden rounded-md border">
    <Image
      src={form.featuredImage}
      alt="Featured"
      fill
      className="object-cover"
    />

    <button
      type="button"
      onClick={() => update("featuredImage", "")}
      className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-2 py-1 text-sm text-white hover:bg-black"
      aria-label="Remove featured image"
    >
      ✕
    </button>
  </div>
)}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Valid from">
          <input
            type="date"
            value={form.validFrom || ""}
            onChange={(e) => update("validFrom", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Valid until">
          <input
            type="date"
            value={form.validUntil || ""}
            onChange={(e) => update("validUntil", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <details className="rounded-md border border-slate-200 p-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          SEO overrides (optional)
        </summary>
        <div className="mt-3 space-y-3">
          <Field label="Meta title">
            <input
              value={form.metaTitle || ""}
              onChange={(e) => update("metaTitle", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Meta description">
            <textarea
              rows={2}
              value={form.metaDescription || ""}
              onChange={(e) => update("metaDescription", e.target.value)}
              className="input"
            />
          </Field>
        </div>
      </details>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e, false)}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          Save as draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e, true)}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-storm-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {form.published ? "Save & keep published" : "Publish now"}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .input:focus {
          outline: 2px solid #f0a825;
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
