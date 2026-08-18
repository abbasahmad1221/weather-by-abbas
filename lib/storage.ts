import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export type UploadResult = { fileUrl: string };

const STORAGE_DRIVER = (
  process.env.STORAGE_DRIVER ||
  (process.env.VERCEL ? "cloudinary" : "local")
).toLowerCase();

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

async function saveLocal(
  buffer: Buffer,
  filename: string
): Promise<UploadResult> {
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, filename), buffer);

  return {
    fileUrl: `/uploads/${filename}`,
  };
}

async function saveCloudinary(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "weather-by-abbas/uploads",
        public_id: filename.replace(/\.[^/.]+$/, ""),
        resource_type: "image",
        format: contentType.split("/")[1],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          fileUrl: result.secure_url,
        });
      }
    );

    upload.end(buffer);
  });
}

export async function saveUpload(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  if (STORAGE_DRIVER === "cloudinary") {
    return saveCloudinary(buffer, filename, contentType);
  }

  return saveLocal(buffer, filename);
}