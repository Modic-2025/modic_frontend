import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.modic.kr",
        pathname: "**",
      },
    ],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
