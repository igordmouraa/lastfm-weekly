import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
      },
    ],
  },
};

export default nextConfig;