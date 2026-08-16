// Upload storage abstraction.
//
// Default: writes to the local filesystem under public/uploads. This works
// on any host with a persistent disk (a VPS, Docker container with a volume,
// Railway/Render with a persistent volume, etc.) — the existing behaviour
// is unchanged and nothing else needs to be configured.
//
// If STORAGE_DRIVER=s3 is set, uploads go to an S3-compatible object store
// instead (AWS S3, Cloudflare R2, Supabase Storage, MinIO, ...). This is
// required on platforms with an ephemeral/read-only filesystem (e.g.
// Vercel), since files written to disk there do not persist between
// requests or deploys.

import { mkdir, writeFile } from "fs/promises";
import path from "path";

export type UploadResult = { fileUrl: string };

const STORAGE_DRIVER = (process.env.STORAGE_DRIVER || (process.env.VERCEL ? "s3" : "local")).toLowerCase();
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function saveLocal(buffer: Buffer, filename: string): Promise<UploadResult> {
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, filename), buffer);
  return { fileUrl: `/uploads/${filename}` };
}

async function saveS3(buffer: Buffer, filename: string, contentType: string): Promise<UploadResult> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "auto";
  const endpoint = process.env.S3_ENDPOINT; // e.g. R2/MinIO/Supabase endpoint; omit for AWS S3
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  // Base URL the files are served from (bucket public URL, custom domain, or CDN)
  const publicUrlBase = process.env.S3_PUBLIC_URL;

  if (!bucket || !accessKeyId || !secretAccessKey || !publicUrlBase) {
    throw new Error(
      "STORAGE_DRIVER=s3 requires S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY and S3_PUBLIC_URL to be set."
    );
  }

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: !!endpoint, // needed for R2/MinIO/most non-AWS S3-compatible endpoints
    credentials: { accessKeyId, secretAccessKey },
  });

  const key = `uploads/${filename}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const base = publicUrlBase.replace(/\/$/, "");
  return { fileUrl: `${base}/${key}` };
}

export async function saveUpload(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  if (STORAGE_DRIVER === "s3") {
    return saveS3(buffer, filename, contentType);
  }
  return saveLocal(buffer, filename);
}
