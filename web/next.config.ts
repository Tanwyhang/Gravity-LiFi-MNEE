import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude server-only packages from being bundled
  serverExternalPackages: [
    'thread-stream',
    'pino',
    'pino-pretty',
    'sonic-boom',
    '@walletconnect/logger',
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only packages from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'thread-stream': 'commonjs thread-stream',
        'pino': 'commonjs pino',
        '@walletconnect/logger': 'commonjs @walletconnect/logger',
        'pino-pretty': 'commonjs pino-pretty',
        'sonic-boom': 'commonjs sonic-boom'
      });
    }

    // Exclude examples directory from build
    config.module.rules.push({
      test: /\.ts$/,
      include: /examples/,
      use: 'ignore-loader'
    });

    // Ignore test files
    config.module.rules.push({
      test: /\.(test|spec)\.(js|ts|tsx)$/,
      use: 'ignore-loader'
    });

    // Fix MetaMask SDK async-storage dependency
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mwtzwo37egeya3fd.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
