import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";

export const metadata: Metadata = {
  title: "천지영 - 포트폴리오",
  description: "AI 기반 개인 연구 포트폴리오 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        {/* @ts-ignore - React version mismatch between root and frontend */}
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


