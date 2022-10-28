/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true
  },
  images: {
    domains: [
      'picsum.photos',
      'cdn.shopify.com',
      'source.unsplash.com',
      'lh3.googleusercontent.com'
    ]
  }
};

module.exports = nextConfig;
