import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "售前协作平台 - 售前方案智能协作平台",
  description: "帮助售前团队高效协作，智能编写方案文档",
  icons: {
    icon: `${basePath}/favicon.ico`,
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/favicon.ico`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
        <link rel="shortcut icon" href={`${basePath}/favicon.ico`} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
