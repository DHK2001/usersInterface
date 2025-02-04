import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/v1',
        destination: 'http://localhost:8083/v1/',
      },
    ]
  },
};

export default nextConfig;
