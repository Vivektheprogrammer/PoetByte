/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration options
  turbopack: {},
  // Enable image remote patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure MongoDB ObjectId serialization works properly
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Configure static generation
  output: 'standalone',
  // Server external packages for Mongoose / MongoDB
  serverExternalPackages: ['mongoose'],
};

module.exports = nextConfig;