import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Articulatory · 交互式调音语音学实验室',
  description:
    '通过可交互 SVG 发音器官、元音舌位图、圆唇动画与 IPA 对比，探索辅音和元音如何产生。',
  icons: {
    // 使用相对路径，避免项目站点和反向代理从域名根目录请求图标。
    icon: 'favicon.svg',
    shortcut: 'favicon.svg',
    apple: 'favicon.svg',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-theme="system" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('articulatory-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:'system'}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
