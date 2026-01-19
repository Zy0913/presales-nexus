import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "售前协作平台 - 售前方案智能协作平台",
  description: "帮助售前团队高效协作，智能编写方案文档",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
