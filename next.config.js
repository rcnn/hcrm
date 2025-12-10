/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // 忽略构建时的类型检查以提高速度
    ignoreBuildErrors: false,
  },
  eslint: {
    // 忽略构建时的ESLint检查
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;