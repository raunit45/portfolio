import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io", // Needed for link preview screenshots
      },
    ],
  },
};

export default nextConfig;
