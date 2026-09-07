import { spawnSync } from 'node:child_process';
import path from 'node:path';

// 直接调用当前 Node 的 npm CLI，避免 Windows 只有 npm.ps1 时无法启动 npm.cmd。
const npmCli =
  process.env.npm_execpath ??
  path.join(
    path.dirname(process.execPath),
    'node_modules',
    'npm',
    'bin',
    'npm-cli.js',
  );
const result = spawnSync(process.execPath, [npmCli, 'run', 'build'], {
  env: {
    ...process.env,
    PAGES_EXPORT: '1',
  },
  stdio: 'inherit',
});

if (result.error) {
  console.error(`无法启动静态构建：${result.error.message}`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
