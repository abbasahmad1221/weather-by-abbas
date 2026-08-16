import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeSlug, slugDatePart } from "@/lib/utils";

const forecastSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(3),
  content: z.string().min(3),
  advisory: z.string().optional().nullable(),
  severity: z.enum(["normal", "watch", "warning", "alert"]).default("normal"),
  region: z.string().default("Jammu & Kashmir"),
  featuredImage: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  published: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  validFrom: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
});

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const forecasts = await prisma.forecast.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(forecasts);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = forecastSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const validFrom = data.validFrom ? new Date(data.validFrom) : null;
  const validUntil = data.validUntil ? new Date(data.validUntil) : null;
  if ((data.validFrom && Number.isNaN(validFrom.getTime())) || (data.validUntil && Number.isNaN(validUntil.getTime()))) {
    return NextResponse.json({ error: "Invalid date value" }, { status: 400 });
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });
  }

  const now = new Date();
  const slug = data.slug?.trim() || makeSlug(data.title, slugDatePart(now));

  const existing = await prisma.forecast.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A forecast with this slug already exists" }, { status: 409 });
  }

  const forecast = await prisma.forecast.create({
    data: {
      title: data.title,
      slug,
      summary: data.summary,
      content: data.content,
      advisory: data.advisory || null,
      severity: data.severity,
      region: data.region,
      featuredImage: data.featuredImage || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      published: data.published,
      publishedAt: data.published ? now : null,
      categoryId: data.categoryId || null,
      validFrom,
      validUntil,
    },
  });

  return NextResponse.json(forecast, { status: 201 });
}
