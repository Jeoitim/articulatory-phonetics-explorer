import type { NextConfig } from 'next';

// Set PAGES_EXPORT=1 to build a fully static site (GitHub Pages / static hosts).
// Default build targets Cloudflare Workers (vinext server output) and is unchanged.
const isStaticExport = process.env.PAGES_EXPORT === '1';

// Site is served under a sub-path on GitHub Pages project sites
// (https://<user>.github.io/<repo>/). Root-domain hosts (Cloudflare Pages,
// EdgeOne Pages) leave PAGES_BASE_PATH unset.
const basePath = process.env.PAGES_BASE_PATH ?? '';

const nextConfig: NextConfig = isStaticExport
  ? {
      output: 'export',
      basePath,
      trailingSlash: true,
    }
  : {};

export default nextConfig;
