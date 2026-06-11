import type { NextConfig } from "next";

function getPocketBaseHostname() {
  const url = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

  try {
    return new URL(url).hostname;
  } catch {
    return "127.0.0.1";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: getPocketBaseHostname(),
      },
      {
        protocol: "https",
        hostname: getPocketBaseHostname(),
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
