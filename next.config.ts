import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  // Partner logos are sent through a server action (default limit: 1 MB).
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  // Native database drivers stay as plain Node modules.
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client", "libsql"],
  // Ship the Linux query engine with the server functions (Netlify).
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"],
  },
};

export default nextConfig;
