/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_UBILO_TOKEN_ADDRESS: process.env.NEXT_UBILO_TOKEN_ADDRESS,
    NEXT_ESIM_MARKET_ADDRESS: process.env.NEXT_ESIM_MARKET_ADDRESS,
    NEXT_POINTS_ADDRESS: process.env.NEXT_POINTS_ADDRESS,
  },
};

export default nextConfig;
