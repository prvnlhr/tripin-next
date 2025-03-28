import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/user/trip/book-ride",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
