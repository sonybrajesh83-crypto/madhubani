import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db", "./prisma/schema.prisma"],
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
