import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:  "img.youtube.com",
        pathname:  "/vi/**",
      },
      {
        protocol: "https",
        hostname:  "dsfxpmkxifcphmnjrciq.supabase.co",
        pathname:  "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname:  "i.ytimg.com",
        pathname:  "/**",
      },
    ],
  },
};

export default nextConfig;