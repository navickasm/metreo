import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    distDir: 'dist',
    basePath: "/metreo",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
