import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      // Tell Turbopack to use ignore-loader for LESS files
      "*.less": {
        loaders: ["ignore-loader"],
        as: "*.js",
      },
    },
  },
  transpilePackages: ["@knight-lab/timelinejs"],
  webpack: (config, { isServer }) => {
    // Webpack fallback: Ignore LESS files from TimelineJS (we use compiled CSS instead)
    config.module.rules.push({
      test: /\.less$/,
      loader: "ignore-loader",
    });

    // Make TimelineJS external for server-side rendering to avoid issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@knight-lab/timelinejs": "commonjs @knight-lab/timelinejs",
      });
    }

    return config;
  },
};

export default nextConfig;
