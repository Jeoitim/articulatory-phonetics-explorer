# 部署指南

本项目由 vinext（Next.js on Vite）驱动，默认构建目标是 **Cloudflare Workers**（带 D1/R2 绑定的服务端输出，见 `vite.config.ts`）。同时支持通过环境变量切换为**纯静态导出**，部署到 GitHub Pages、Cloudflare Pages、EdgeOne Pages 等静态托管。

## 构建模式

| 环境变量 | 作用 | 缺省行为 |
| --- | --- | --- |
| `PAGES_EXPORT=1` | 启用静态导出（`output: "export"`，全站预渲染为 HTML） | 不设置则走 Cloudflare Workers 构建流程 |
| `PAGES_BASE_PATH=/xxx` | 为所有资源与路由加子路径前缀 | 不设置则根路径部署 |

配置入口在 `next.config.ts`，两种模式互不影响本地开发（`npm run dev`）。

- **Cloudflare Workers（默认）**：`npm run build` → `dist/`（client + server），`npm start` 用 wrangler 本地预览。
- **静态导出**：`PAGES_EXPORT=1 npm run build` → 产物在 `dist/client/`；若设置了 `PAGES_BASE_PATH`，产物在其对应子目录内。

> 注意：静态导出模式下全站路由会预渲染（当前为 `/` 与 404），动态 API、D1/R2 绑定不可用。本项目为纯前端交互（IPA 发音 Explorer + 本地音频），静态导出完全够用。

---

## GitHub Pages（已配置，推荐）

工作流：`.github/workflows/deploy-pages.yml`，推送到 `main` 或手动触发（workflow_dispatch）即自动构建部署。

**一次性设置（必需）**：

1. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
   （也可用 API 设置：`gh api -X POST repos/Jeoitim/articulatory-phonetics-explorer/pages -f build_type=workflow`）
2. 推送或手动运行 workflow。
3. 部署完成后访问：<https://jeoitim.github.io/articulatory-phonetics-explorer/>

**工作流要点**：

- Node 22 + `npm ci` + `npm run build`（`PAGES_EXPORT=1`、`PAGES_BASE_PATH=/articulatory-phonetics-explorer`）。
- GitHub Pages 项目站点以 `https://<user>.github.io/<repo>/` 为根路径，vinext 导出产物位于 `dist/client/<basePath>/`，工作流直接以该内层目录为工件根，避免双重前缀；并把 `dist/client/404.html` 一并复制进去以启用自定义 404 页。
- `concurrency: pages` 保证并发部署互相取消，不会堆积。

本地验证导出结果（可选）：

```bash
PAGES_EXPORT=1 PAGES_BASE_PATH=/articulatory-phonetics-explorer npm run build
# 产物在 dist/client/articulatory-phonetics-explorer/
```

> ⚠️ 本机在 WorkBuddy 环境内构建时，vinext / sites 插件清理 `dist/` 会触发「安全删除」拦截器报 `SAFE_DELETE_BULK_CONFIRM_REQUIRED`。构建前先 `rm -rf dist`，或临时设置 `CODEBUDDY_SAFE_DELETE_ENABLED=0`。CI 上无此问题。

---

## Cloudflare Pages

Cloudflare Pages 以独立域名（`*.pages.dev`）为根路径部署，**不需要 basePath**。

方式 A —— Dashboard 连接 Git（推荐）：

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git，选本仓库。
2. 构建配置：
   - Framework preset: None（或 Vite）
   - Build command: `npm run build`
   - Build output directory: `dist/client`
   - Environment variable: `PAGES_EXPORT` = `1`
   - Node version: 环境变量 `NODE_VERSION` = `22`（项目 engines 要求 ≥22.13）
3. 保存部署，后续推送自动触发。

方式 B —— Wrangler CLI 直传：

```bash
PAGES_EXPORT=1 npm run build
npx wrangler pages deploy dist/client --project-name=articulatory-phonetics-explorer
```

> 项目当前默认构建目标本就是 Cloudflare Workers（`dist/` + wrangler）。如果想要服务端能力（D1/R2、动态路由），优先用 Workers 部署而非 Pages；本项目当前为纯静态场景，两种方式均可。

---

## EdgeOne Pages

腾讯云 EdgeOne Pages 同样以独立域名为根路径，**不需要 basePath**。

1. EdgeOne 控制台 → Pages → 创建项目 → 连接 Git 仓库（GitHub）。
2. 构建配置：
   - Build command: `npm run build`
   - Output directory: `dist/client`
   - 环境变量：`PAGES_EXPORT` = `1`，`NODE_VERSION` = `22`
3. 部署后获得 `*.edgeone.app` 域名，可绑定自定义域名（国内访问速度优于 GitHub Pages）。

---

## 各平台对比速查

| 平台 | basePath | 构建命令 | 产物目录 | 国内访问 |
| --- | --- | --- | --- | --- |
| GitHub Pages | `/articulatory-phonetics-explorer` | `npm run build` | `dist/client/<basePath>/`（workflow 已处理） | 一般 |
| Cloudflare Pages | 无需 | `npm run build` | `dist/client` | 一般 |
| EdgeOne Pages | 无需 | `npm run build` | `dist/client` | 好 |

所有静态平台共同前提：环境变量 `PAGES_EXPORT=1`；Node ≥ 22.13。
