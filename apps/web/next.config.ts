import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@adhikaar/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
