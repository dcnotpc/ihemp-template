import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_STATE: process.env.NEXT_PUBLIC_STATE || "colorado"
  }
};

export default nextConfig;
