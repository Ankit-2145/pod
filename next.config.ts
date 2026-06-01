import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "at1smw10ux.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "ankit-sharma-oi",

  project: "pod",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  webpack: {
    automaticVercelMonitors: true,

    treeshake: {
      removeDebugLogging: true,
    },
  },
});
