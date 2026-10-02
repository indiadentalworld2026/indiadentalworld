/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output static HTML per route when deploying to CDN/S3
  // Switch to 'standalone' for Docker / Node server deployments
  // output: 'export',

  images: {
    // Allow clinic photos served from your CDN
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.indiadentalworld.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
    // Output format priority: AVIF first (50% smaller than WebP), then WebP fallback
    formats: ['image/avif', 'image/webp'],
    // Srcset breakpoints matching IMAGE_RULES outputWidths
    deviceSizes: [400, 600, 800, 900, 1200],
    imageSizes: [180, 280, 360],
    // Cache optimised images for 30 days on CDN
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Redirect legacy hash URLs to real section URLs
  async redirects() {
    const sections = ['team', 'results', 'reviews', 'life', 'info'];
    return sections.map((s) => ({
      source: `/clinics/:clinicSlug`,
      has: [{ type: 'query', key: 'section', value: s }],
      destination: `/clinics/:clinicSlug/${s}`,
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
