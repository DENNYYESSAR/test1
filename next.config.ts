import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to enable API routes and server-side features
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'readdy.ai',
        pathname: '/api/search-image/**',
      },
    ],
  },
  typescript: {
    // Ensure type checking is enabled
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
