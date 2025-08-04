import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      new URL("https://syncspotmain.s3.amazonaws.com/post/**"),
      new URL("https://modic-main.s3.ap-northeast-2.amazonaws.com/**"),
      new URL("https://images.unsplash.com/**"),
    ],
  },
};

export default nextConfig;
