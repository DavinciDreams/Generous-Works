import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(), // Explicitly set root to current working directory
  },
};

export default nextConfig;
