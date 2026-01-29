import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "http://localhost:8000/images/:path*",
      },
    ]
  },
};

export default nextConfig;
