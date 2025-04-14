import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
  
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Add the Monaco webpack plugin only on client-side builds
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: [
            'javascript',
            'typescript',
            'python',
            'html',
            'css',
            'java',
            'cpp',
          ],
          features: ['suggest', 'hover', 'format', 'folding'],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
