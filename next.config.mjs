/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cdn.thefashionsalad.com',
      },
      {
        protocol: 'https',
        hostname: 'images.cdn.thefashionsalad.com',
      },
      {
        protocol: 'https',
        hostname: 'the-fashion-salad.blr1.cdn.digitaloceanspaces.com',
      },
    ],
  },
}

export default nextConfig
