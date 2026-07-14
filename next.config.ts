import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static export served from /<repo>/ on GitHub Pages.
// Without it (local dev, Vercel) the app runs as a normal Next.js app and the
// /api/license route works for real Whop license validation.
const isGithubPages = process.env.GITHUB_PAGES === "1";
const repo = "lumenite";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repo}` : "",
    NEXT_PUBLIC_STATIC_DEMO: isGithubPages ? "1" : "",
  },
};

export default nextConfig;
