import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/storage";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const caption = (formData.get("caption") as string) || null;
  const source = (formData.get("source") as string) || null;
  const capturedAt = (formData.get("capturedAt") as string) || null;
  const forecastId = (formData.get("forecastId") as string) || null;
  const asMedia = formData.get("asMedia") === "true";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }
  if (capturedAt && Number.isNaN(new Date(capturedAt).getTime())) {
    return NextResponse.json({ error: "Invalid captured date" }, { status: 400 });
  }
  if (asMedia && forecastId) {
    const forecast = await prisma.forecast.findUnique({ where: { id: forecastId }, select: { id: true } });
    if (!forecast) return NextResponse.json({ error: "Forecast not found" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const metadata = await sharp(buffer).metadata();
    const expectedFormat: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpeg",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    if (!metadata.format || metadata.format !== expectedFormat[file.type]) {
      return NextResponse.json(
        { error: "The uploaded file is not a valid image of the declared type." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "The uploaded file could not be read as an image." }, { status: 400 });
  }

  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;

  let fileUrl: string;
  try {
    ({ fileUrl } = await saveUpload(buffer, filename, file.type));
  } catch (err) {
    console.error("Upload storage error:", err);
    return NextResponse.json({ error: "Failed to store uploaded file" }, { status: 500 });
  }

  if (asMedia) {
    const media = await prisma.media.create({
      data: {
        fileUrl,
        fileType: file.type,
        caption,
        source,
        capturedAt: capturedAt ? new Date(capturedAt) : null,
        forecastId: forecastId || null,
      },
    });
    return NextResponse.json(media, { status: 201 });
  }

  return NextResponse.json({ fileUrl }, { status: 201 });
}
