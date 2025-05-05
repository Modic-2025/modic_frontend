import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      new URL("https://syncspotmain.s3.amazonaws.com/post/**"),
      new URL("https://modic-main.s3.ap-northeast-2.amazonaws.com/**"),
    ],
  },
};

export default nextConfig;
