/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every route is statically prerendered (no server-side conversion logic; ADR-0001).
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
