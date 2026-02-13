import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Configure Turbopack rules for optimal performance
    rules: {
      // Tell Turbopack to use ignore-loader for LESS files
      "*.less": {
        loaders: ["ignore-loader"],
        as: "*.js",
      },
    },
  },
  
  // Transpile packages that need it
  transpilePackages: ["@knight-lab/timelinejs"],
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack fallback: Keep for compatibility and specific package handling
  webpack: (config, { isServer, dev }) => {
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
    
    // Optimize webpack for development when not using Turbopack
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    return config;
  },
};

export default nextConfig;
