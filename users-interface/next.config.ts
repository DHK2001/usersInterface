import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGO_URL: 'http://localhost:8083/v1/mongoDB',
    MSSQL_URL: 'http://localhost:8083/v1',
  },
};

export default nextConfig;
