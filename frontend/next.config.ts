import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.strapiapp.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**.railway.app" },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://takainside.vercel.app",
  },
  async rewrites() {
    return [
      {
        source: '/faire-un-don',
        destination: '/faire-un-don.html',
      },
      {
        source: '/checkout',
        destination: '/checkout.html',
      },
    ];
  },
};

export default nextConfig;
// Force rebuild 1780940001
