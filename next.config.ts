import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/labs/split-bill",
  assetPrefix: "/labs/split-bill",
  serverExternalPackages: ["ws"],
};

export default nextConfig;
