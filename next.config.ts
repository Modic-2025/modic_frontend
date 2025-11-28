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
    unoptimized: true,
  },
  output: "standalone",
  generateBuildId: async () => {
    // 단, 코드가 바뀌었을 때 브라우저가 구버전을 볼 수도 있으니 주의해야 합니다.
    return "modic-v-0.1.0";
  },
};

export default nextConfig;
