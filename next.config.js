/** @type {import('next').NextConfig} */
const s3PublicUrl = process.env.S3_PUBLIC_URL;
let remotePatterns = [];

if (s3PublicUrl) {
  try {
    const url = new URL(s3PublicUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    });
  } catch {
    // Invalid S3_PUBLIC_URL is reported by the upload layer.
  }
}

const nextConfig = {
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
