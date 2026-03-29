import type { NextConfig } from "next";

// const internalApiUrl = process.env.INTERNAL_API_URL || "http://backend:3333";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://eac-backend:3333/api/:path*`,
      },
    ];
  },
};

export default nextConfig;