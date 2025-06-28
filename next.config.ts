import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blog/feed/1',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**"
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ]
  }
};

export default nextConfig;
