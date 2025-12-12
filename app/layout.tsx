import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "천지영 포트폴리오 | Jiyeong Kim Portfolio",
  description: "AI 기반 개인 연구 포트폴리오 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <Navigation />
        <main className="min-h-screen bg-black">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
