import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbo: {
    enabled: true
  }
};

export default nextConfig;
