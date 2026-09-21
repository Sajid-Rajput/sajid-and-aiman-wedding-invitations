import type { NextConfig } from "next";

/**
 * Canonical origin, resolved at build time on the server and inlined into the client bundle.
 * Next only inlines NEXT_PUBLIC_* variables, so the VERCEL_* fallbacks have to be resolved here;
 * reading them from a module that a client component imports would silently yield the placeholder.
 * Preview deployments use the branch URL, never the per-deployment URL (that one is protected and
 * would hand WhatsApp a "Protected Deployment" card).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`;
  return "https://sajid-aiman-nikkah.vercel.app";
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Hide the dev overlay badge so screenshots (OG image) come out clean.
  devIndicators: false,
  env: { NEXT_PUBLIC_SITE_URL: resolveSiteUrl() },
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        // Static calligraphy assets are versioned by content; let the CDN keep them.
        source: "/calligraphy/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
