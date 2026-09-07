# 部署指南

本项目由 vinext（Next.js on Vite）驱动，同时支持 Cloudflare Workers 服务端构建和纯静态托管。音频、站点图标和署名文件都属于静态资源，发布时必须与页面一起上传。

## 快速选择

| 部署方式 | 构建命令 | 发布目录 | 子路径设置 |
| --- | --- | --- | --- |
| Cloudflare Workers / Sites 服务端 | `npm run build` | 按平台发布 `dist/server`，并保留 `dist/client` 静态资源 | 不设置 `PAGES_BASE_PATH` |
| Cloudflare Pages 静态站点、Netlify、Vercel 静态导出、EdgeOne 等根域名站点 | `npm run build:static` | `dist/client` | 不设置 `PAGES_BASE_PATH` |
| GitHub Pages 项目站点 | `npm run build:static` | `dist/client/articulatory-phonetics-explorer` | `PAGES_BASE_PATH=/articulatory-phonetics-explorer` |
| 反向代理下的自定义子目录 | `npm run build:static` | `dist/client/<子目录>` | 例如 `PAGES_BASE_PATH=/phonetics` |

`build:static` 会跨 Windows、macOS、Linux 设置静态导出开关，不需要依赖 shell 特有的环境变量写法。`PAGES_BASE_PATH` 可以带或不带首尾斜杠，构建配置会统一整理为 `/目录名`；根域名部署时保持为空。

默认的 `npm run build` 面向 Cloudflare Workers，产物包括 `dist/server` 和 `dist/client`，可用 `npm start` 配合 Wrangler 本地预览。静态导出会预渲染入口页和 404 页，不提供动态 API、D1 或 R2 绑定；本项目的交互逻辑和录音清单都在浏览器端运行，因此静态导出可以满足完整功能。

## 构建模式

| 环境变量 | 作用 | 缺省行为 |
| --- | --- | --- |
| `PAGES_EXPORT=1` | 开启静态导出（`output: "export"`） | 走 Cloudflare Workers 构建流程 |
| `PAGES_BASE_PATH=/xxx` | 为资源和路由增加子路径前缀 | 根路径部署 |

推荐使用 `npm run build:static`，它会自动设置 `PAGES_EXPORT=1`；只有需要手动调用底层构建命令时，才直接设置该变量。

## 相关入口

- GitHub Pages 的完整流程见 [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml)。工作流会发布项目子目录、补齐 `404.html`，并执行静态产物检查。
- 静态导出的路径规则见 [`next.config.ts`](../next.config.ts)。默认的服务端构建仍由 [`vite.config.ts`](../vite.config.ts) 和 vinext 负责。
- 音频清单位于 [`public/audio/manifest.json`](../public/audio/manifest.json)，来源与许可说明位于 [`public/attribution`](../public/attribution)。

## 各种部署方式的注意事项

### GitHub Pages 项目站点

GitHub Pages 项目地址包含仓库名这一层路径。发布时必须上传 `dist/client/articulatory-phonetics-explorer` 的内容，而不是再套一层同名目录，否则页面会出现重复路径。工作流已经处理这一点，并把静态导出的根级 `404.html` 复制到项目目录中。

首次启用时，在仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。推送到 `main` 或手动运行工作流后，站点地址为 [https://jeoitim.github.io/articulatory-phonetics-explorer/](https://jeoitim.github.io/articulatory-phonetics-explorer/)。

如果手动部署，请在构建前设置：

```sh
PAGES_BASE_PATH=/articulatory-phonetics-explorer npm run build:static
```

Windows PowerShell 可以写成：

```powershell
$env:PAGES_BASE_PATH = "/articulatory-phonetics-explorer"
npm run build:static
```

工作流使用 Node 22、`npm ci` 和并发取消策略；它会在上传前运行 `npm run deployment:check`，确认入口页、图标、署名、清单和 120 条本地录音都在正确的项目子目录中。

### 根域名静态托管

Cloudflare Pages、Netlify、Vercel 的静态项目或其他根域名托管不设置 `PAGES_BASE_PATH`，直接发布 `dist/client`。平台若支持 SPA 回退，应把未知页面回退到 `404.html` 或 `index.html`；同时不要把 `/audio/*`、`/favicon.svg` 和 `/attribution/*` 重写到页面入口。

Cloudflare Pages 控制台可将构建命令设为 `npm run build:static`、输出目录设为 `dist/client`，Node 版本设为 22；使用 Wrangler 直传时运行：

```sh
npm run build:static
npx wrangler pages deploy dist/client --project-name=articulatory-phonetics-explorer
```

腾讯云 EdgeOne Pages 使用同样的构建命令和输出目录，独立域名部署不需要设置子路径。Vercel 或 Netlify 选择静态导出时，也使用 `npm run build:static`，并将 `dist/client` 设为发布目录。

如果需要 D1、R2 或动态路由，应改用默认的 Cloudflare Workers 构建，不要把服务端产物当成纯静态目录上传。

### 反向代理和自定义子目录

若站点通过 Nginx、Apache 或企业网关挂在 `/phonetics/` 等目录下，设置对应的 `PAGES_BASE_PATH` 并发布同名子目录。代理应保留末尾斜杠并将 `/phonetics/` 指向该目录中的 `index.html`。页面内的音频、图标和署名链接均按当前页面目录解析，可以处理带斜杠和不带斜杠的直接访问。

### 本地预览

静态产物需要通过 HTTP 服务器预览，不要直接双击 `index.html`。直接使用 `file://` 打开时，浏览器可能阻止清单读取，导致音频按钮只能显示来源提示。可以在发布目录运行任意静态文件服务器，例如：

```sh
python -m http.server 4173 --directory dist/client
```

## 音频播放与在线备用

播放顺序是：仓库内的本地录音 → 对应来源页的 Wikimedia Commons `Special:FilePath` 在线媒体。当前清单包含 120 条本地录音；本地文件缺失、浏览器不支持其格式或加载失败时，播放器会自动尝试在线地址，并在状态提示中说明正在使用备用录音。在线备用需要网络连接，浏览器的音频播放策略仍要求用户点击播放按钮。

静态服务器必须正确返回音频类型：`.ogg` 使用 `audio/ogg`，`.wav` 使用 `audio/wav`。不要把音频文件压缩成无法直接播放的响应，也不要为音频请求添加页面 HTML。部分旧版浏览器对 Ogg 支持有限，在线来源页通常提供兼容格式；若仍无法播放，可从播放器旁的来源链接打开 Commons 页面。替换录音后建议使用新的文件名，或清理 CDN 缓存，避免旧清单和旧音频同时被缓存。

## 发布前检查

在提交或发布前运行：

```sh
npm ci
npm run typecheck
npm test
npm run lint
npm run build
npm run build:static
npm run deployment:check
```

`deployment:check` 会根据 `PAGES_BASE_PATH` 定位静态产物，并检查入口页、`404.html`、站点图标、署名文件、音频清单以及清单中的每一条本地音频是否存在。根域名部署运行检查前保持变量为空；项目子路径部署则使用与构建相同的值。

## 常见故障

| 现象 | 常见原因 | 处理 |
| --- | --- | --- |
| 页面能打开但样式或音频 404 | 把项目站点当成根域名发布，或忘记设置 `PAGES_BASE_PATH` | 使用 `npm run build:static` 并设置正确子路径，发布对应嵌套目录 |
| GitHub Pages 刷新后出现 404 | 没有把 `404.html` 放到项目发布目录 | 使用仓库工作流，或将 `dist/client/404.html` 复制到子目录 |
| 音频只在本地开发环境可用 | 静态服务器没有上传 `public/audio`，或错误重写了 `/audio/*` | 检查 `audio/manifest.json` 和 `npm run deployment:check` 的结果 |
| 播放提示本地失败后仍无声音 | 浏览器不支持 Ogg、网络被阻断，或远程来源暂时不可用 | 检查 `audio/ogg` 响应类型，重试在线备用并打开来源页 |
| 图标缺失 | 托管平台只允许相对资源，旧版本仍使用根路径图标 | 重新构建并确认发布目录包含 `favicon.svg` |
