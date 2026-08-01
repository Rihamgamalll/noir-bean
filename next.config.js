/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // Vercel/Next.js يختار AVIF أو WebP تلقائيًا حسب المتصفح.
    formats: ["image/avif", "image/webp"],

    // مقاسات مناسبة للموبايل والتابلت والديسكتوب.
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1440, 1920],

    imageSizes: [32, 48, 64, 96, 128, 256, 384],

    // كاش طويل للصور المحسنة.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,

  poweredByHeader: false,
};

module.exports = nextConfig;
