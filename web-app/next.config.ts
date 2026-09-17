import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: `http://backend:3333/api/:path*`, // Docker service name
        destination: `http://127.0.0.1:3333/api/:path*`,
      },
    ];
  },
};

export default nextConfig;