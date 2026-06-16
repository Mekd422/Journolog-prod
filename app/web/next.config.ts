import type { NextConfig } from "next";

function getPocketBaseURLConfig() {
  const urlString = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

  try {
    const url = new URL(urlString);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? "" : "80"),
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "127.0.0.1",
      port: "8090",
    };
  }
}

const pbConfig = getPocketBaseURLConfig();

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // 1. Dynamic pattern based on your environment variable
      {
        protocol: pbConfig.protocol,
        hostname: pbConfig.hostname,
        port: pbConfig.port,
        pathname: "/api/files/**",
      },
      // 2. Hardcoded fallback for local 127.0.0.1 development
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
      // 3. Hardcoded fallback for local localhost development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;