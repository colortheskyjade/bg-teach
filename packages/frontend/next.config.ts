import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "development" 
          ? "http://127.0.0.1:3001/api/:path*"
          : "http://backend:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
