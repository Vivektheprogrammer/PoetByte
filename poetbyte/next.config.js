/** @type {import('next').NextConfig} */
const nextConfig = {
  // Updated Turbopack configuration for Next.js 15+
  turbopack: {
    // Turbopack configuration options
  },
  // Enable static image imports
  images: {
    domains: ['via.placeholder.com'],
  },
  // Ensure MongoDB ObjectId serialization works properly
  webpack: (config) => {
    // This helps ensure proper serialization of MongoDB ObjectIds
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Configure static generation
  output: 'standalone',
  // Disable strict mode for dynamic server usage errors
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;