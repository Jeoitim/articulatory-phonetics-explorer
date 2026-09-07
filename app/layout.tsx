import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Articulatory · 交互式调音语音学实验室',
  description:
    '通过可交互 SVG 发音器官、元音舌位图、圆唇动画与 IPA 对比，探索辅音和元音如何产生。',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
