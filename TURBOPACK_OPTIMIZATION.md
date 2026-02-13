# Turbopack Optimization Guide

This document outlines the Turbopack optimizations applied to the Next.js project to improve build performance and development experience.

## Overview

Turbopack is Next.js's new bundler written in Rust, offering significantly faster build times compared to Webpack. This project has been optimized to leverage Turbopack's capabilities for both development and production builds.

## Configuration Changes

### 1. Package.json Scripts

Updated npm scripts to explicitly use Turbopack:

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "dev:webpack": "next dev --no-turbopack",
    "build": "next build",
    "build:turbo": "next build --turbo",
    "clean:turbo": "rm -rf .next/turbo"
  }
}
```

**Key Changes:**
- `dev`: Now explicitly uses `--turbo` flag for faster development builds
- `dev:webpack`: Fallback to Webpack if needed for compatibility
- `build:turbo`: Experimental Turbopack production builds (when available)
- `clean:turbo`: Script to clear Turbopack cache

### 2. Next.js Configuration (next.config.ts)

Enhanced configuration with Turbopack-specific optimizations:

```typescript
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.less": {
        loaders: ["ignore-loader"],
        as: "*.js",
      },
    },
  },
  transpilePackages: ["@knight-lab/timelinejs"],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer, dev }) => {
    // Webpack fallback configuration
    config.module.rules.push({
      test: /\.less$/,
      loader: "ignore-loader",
    });
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@knight-lab/timelinejs": "commonjs @knight-lab/timelinejs",
      });
    }
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
```

**Key Optimizations:**
- Turbopack rules for handling LESS files
- Image optimization with modern formats (AVIF, WebP)
- Console removal in production builds
- Webpack fallback with filesystem caching
- Package transpilation for compatibility

### 3. Environment Variables

Added Turbopack-specific environment variables to `.env.local` and `.env.example`:

```bash
# Enable Turbopack for development and production builds
TURBOPACK=1

# Increase Turbopack memory limit for large projects (in MB)
TURBOPACK_MEMORY_LIMIT=4096
```

**Available Environment Variables:**
- `TURBOPACK=1`: Enable Turbopack
- `TURBOPACK_MEMORY_LIMIT=4096`: Memory limit in MB (default: 2048)
- `TURBOPACK_CACHE_DIR`: Custom cache directory (default: `.next/turbo`)
- `TURBOPACK_EXPERIMENTAL=1`: Enable experimental features
- `TURBOPACK_PARALLEL=true`: Enable parallel processing (default: true)
- `TURBOPACK_VERBOSE=0`: Verbose logging for debugging

## Usage

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

This will start the Next.js development server using Turbopack, providing:
- Faster initial startup
- Instant hot module replacement (HMR)
- Faster rebuild times on file changes

### Production Build

Build the application for production:

```bash
npm run build
```

For experimental Turbopack production builds (when available):

```bash
npm run build:turbo
```

### Clearing Cache

If you encounter build issues, clear the Turbopack cache:

```bash
npm run clean:turbo
```

Or manually:

```bash
rm -rf .next/turbo
```

### Fallback to Webpack

If you need to use Webpack instead of Turbopack (for compatibility or debugging):

```bash
npm run dev:webpack
```

## Performance Improvements

### Expected Performance Gains

- **Initial startup**: 2-3x faster than Webpack
- **Hot module replacement**: Near-instant updates
- **Build times**: 10-20x faster for large projects
- **Incremental builds**: Significantly faster rebuilds

### Memory Usage

Turbopack is more memory-efficient than Webpack, but for large projects, you may need to increase the memory limit:

```bash
TURBOPACK_MEMORY_LIMIT=4096
```

## Troubleshooting

### Common Issues

1. **Out of Memory Errors**
   - Increase `TURBOPACK_MEMORY_LIMIT` in `.env.local`
   - Close unnecessary applications
   - Use `npm run clean:turbo` to clear cache

2. **Build Failures**
   - Clear Turbopack cache: `npm run clean:turbo`
   - Try Webpack fallback: `npm run dev:webpack`
   - Check for incompatible dependencies

3. **Slow Performance**
   - Ensure `TURBOPACK=1` is set in environment variables
   - Check system resources (CPU, RAM)
   - Review package dependencies for optimization opportunities

### Debugging

Enable verbose logging for troubleshooting:

```bash
TURBOPACK_VERBOSE=1 npm run dev
```

## Deployment

### Vercel

Turbopack is automatically used on Vercel for Next.js 16+ projects. No additional configuration needed.

### Other Platforms

Ensure the following environment variables are set:

```bash
TURBOPACK=1
TURBOPACK_MEMORY_LIMIT=4096
```

### CI/CD

Update your CI/CD pipeline to use Turbopack:

```yaml
- name: Install dependencies
  run: npm ci

- name: Build with Turbopack
  run: npm run build
  env:
    TURBOPACK: 1
    TURBOPACK_MEMORY_LIMIT: 4096
```

## Best Practices

1. **Always use Turbopack for development** - It provides the best developer experience
2. **Monitor memory usage** - Adjust `TURBOPACK_MEMORY_LIMIT` as needed
3. **Clear cache periodically** - Run `npm run clean:turbo` if you encounter issues
4. **Keep dependencies updated** - Turbopack compatibility improves with newer versions
5. **Use Webpack fallback when needed** - For debugging or compatibility issues

## Migration Notes

This project was already using Next.js 16.1.6, which includes Turbopack support by default. The optimizations applied:

1. Explicit Turbopack configuration in scripts
2. Enhanced next.config.ts with Turbopack-specific settings
3. Environment variables for Turbopack tuning
4. Webpack fallback configuration for compatibility

## Resources

- [Next.js Turbopack Documentation](https://nextjs.org/docs/architecture/turbopack)
- [Turbopack GitHub Repository](https://github.com/vercel/turbopack)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)

## Version Information

- Next.js: 16.1.6
- React: 19.2.3
- Turbopack: Included with Next.js 16+

---

**Last Updated:** 2025-02-13
**Maintained by:** DevOps Team
