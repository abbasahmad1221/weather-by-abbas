 import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getCloudinaryPublicId(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);

    const uploadIndex = url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return null;
    }

    let path = url.pathname.substring(uploadIndex + "/upload/".length);

    const parts = path.split("/");

    // Remove transformation segments such as:
    // w_1200,h_800,c_fill
    while (
      parts.length > 0 &&
      (parts[0].includes("_") || parts[0].includes(","))
    ) {
      parts.shift();
    }

    path = parts.join("/");

    // Remove version, for example:
    // v1234567890/weather-by-abbas/uploads/image.jpg
    if (path.startsWith("v")) {
      const versionMatch = path.match(/^v\d+\//);

      if (versionMatch) {
        path = path.substring(versionMatch[0].length);
      }
    }

    // Remove file extension
    path = path.replace(/\.[^/.]+$/, "");

    return path || null;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    const publicId = getCloudinaryPublicId(media.fileUrl);

    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      console.log("Cloudinary delete result:", result);
    }

    await prisma.media.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Weather map deleted successfully",
    });
  } catch (error) {
    console.error("Media delete error:", error);

    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}