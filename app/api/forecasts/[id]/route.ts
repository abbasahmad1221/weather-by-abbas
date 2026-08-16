import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  return getServerSession(authOptions);
}

const optionalDate = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.string().datetime(), z.null()])
  .optional();

const patchSchema = z.object({
  title: z.string().min(3).optional(),
  summary: z.string().min(3).optional(),
  content: z.string().min(3).optional(),
  advisory: z.string().nullable().optional(),
  severity: z.enum(["normal", "watch", "warning", "alert"]).optional(),
  region: z.string().min(1).optional(),
  featuredImage: z.string().url().or(z.string().startsWith("/")).nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  validFrom: optionalDate,
  validUntil: optionalDate,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  published: z.boolean().optional(),
});

function parseDate(value: string | null | undefined) {
  if (value == null || value === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const forecast = await prisma.forecast.findUnique({
    where: { id: params.id },
    include: { category: true, maps: true },
  });
  if (!forecast) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(forecast);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body && typeof body === "object") {
    if (body.featuredImage === "") body.featuredImage = null;
    if (body.categoryId === "") body.categoryId = null;
    if (body.slug === "") delete body.slug;
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const current = await prisma.forecast.findUnique({ where: { id: params.id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = parsed.data;

  if (data.slug && data.slug !== current.slug) {
    const existing = await prisma.forecast.findUnique({ where: { slug: data.slug } });
    if (existing) return NextResponse.json({ error: "A forecast with this slug already exists" }, { status: 409 });
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });
  }

  const validFrom = data.validFrom !== undefined ? parseDate(data.validFrom) : undefined;
  const validUntil = data.validUntil !== undefined ? parseDate(data.validUntil) : undefined;
  if ((data.validFrom !== undefined && validFrom === undefined) || (data.validUntil !== undefined && validUntil === undefined)) {
    return NextResponse.json({ error: "Invalid date value" }, { status: 400 });
  }

  const willPublish = data.published === true && !current.published;

  const updated = await prisma.forecast.update({
    where: { id: params.id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.summary !== undefined && { summary: data.summary }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.advisory !== undefined && { advisory: data.advisory }),
      ...(data.severity !== undefined && { severity: data.severity }),
      ...(data.region !== undefined && { region: data.region }),
      ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
      ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
      ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.validFrom !== undefined && { validFrom }),
      ...(data.validUntil !== undefined && { validUntil }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.published !== undefined && {
        published: data.published,
        publishedAt: data.published ? (willPublish ? new Date() : current.publishedAt ?? new Date()) : null,
      }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.forecast.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.forecast.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
