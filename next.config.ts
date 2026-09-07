import type { NextConfig } from 'next';

// 设置 PAGES_EXPORT=1 可构建完整静态站点（GitHub Pages / 静态托管）。
// 默认构建面向 Cloudflare Workers（vinext 服务端产物），行为保持不变。
const isStaticExport = process.env.PAGES_EXPORT === '1';

// GitHub Pages 项目站点通过子路径提供服务
//（https://<user>.github.io/<repo>/）。根域名托管（Cloudflare Pages、
// EdgeOne Pages）不设置 PAGES_BASE_PATH。
const rawBasePath = process.env.PAGES_BASE_PATH?.trim() ?? '';
const normalizedBasePath = rawBasePath.replace(/^\/+|\/+$/g, '');
const basePath = normalizedBasePath ? `/${normalizedBasePath}` : '';

const nextConfig: NextConfig = isStaticExport
  ? {
      output: 'export',
      basePath,
      trailingSlash: true,
    }
  : {};

export default nextConfig;
