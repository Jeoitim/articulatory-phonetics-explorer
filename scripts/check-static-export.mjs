import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const rawBasePath = process.env.PAGES_BASE_PATH?.trim() ?? '';
const normalizedBasePath = rawBasePath.replace(/^\/+|\/+$/g, '');
const artifactRoot = path.resolve(
  'dist',
  'client',
  ...(normalizedBasePath ? [normalizedBasePath] : []),
);

function fail(message) {
  console.error(`静态产物检查失败：${message}`);
  process.exit(1);
}

if (!existsSync(artifactRoot) || !statSync(artifactRoot).isDirectory()) {
  fail(`找不到产物目录 ${artifactRoot}`);
}

for (const relativePath of [
  'index.html',
  '404.html',
  'favicon.svg',
  'audio/manifest.json',
  'attribution/anatomy.txt',
]) {
  const filePath = path.join(artifactRoot, relativePath);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    fail(`缺少 ${relativePath}`);
  }
}

const indexHtml = readFileSync(path.join(artifactRoot, 'index.html'), 'utf8');
if (!/(?:href|src)="(?:\.\/)?favicon\.svg"/.test(indexHtml)) {
  fail('入口页没有使用相对路径引用 favicon.svg');
}
if (
  normalizedBasePath &&
  /(?:href|src)="\/(?:_next|audio|attribution|favicon\.svg)/.test(indexHtml)
) {
  fail('项目子路径入口页仍包含指向域名根目录的资源地址');
}

let manifest;
try {
  manifest = JSON.parse(
    readFileSync(path.join(artifactRoot, 'audio/manifest.json'), 'utf8'),
  );
} catch (error) {
  fail(`无法读取音频清单：${error.message}`);
}

if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
  fail('音频清单必须是按 IPA 符号索引的对象');
}

const rootPrefix = `${artifactRoot}${path.sep}`;
const missingAudio = [];
for (const [symbol, item] of Object.entries(manifest)) {
  if (
    !item ||
    typeof item.audioUrl !== 'string' ||
    !item.audioUrl.startsWith('/audio/')
  ) {
    fail(`${symbol} 的本地音频地址必须以 /audio/ 开头`);
  }
  const filePath = path.resolve(
    artifactRoot,
    item.audioUrl.replace(/^\/+/, ''),
  );
  if (!filePath.startsWith(rootPrefix) || !existsSync(filePath)) {
    missingAudio.push(`${symbol} → ${item.audioUrl}`);
  }
}

if (missingAudio.length > 0) {
  fail(
    `缺少 ${missingAudio.length} 个本地音频文件：${missingAudio.slice(0, 5).join(', ')}`,
  );
}

console.log(
  `静态产物检查通过：${Object.keys(manifest).length} 条音频清单，目录 ${artifactRoot}`,
);
