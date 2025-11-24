// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import MasterLayout from "@/Layouts/MasterLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MODIC",
  description: "MODIC 서비스입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const headerList = await headers();
  // const pathname = headerList.get("x-pathname") || "/";
  // const isLandingPage = pathname === "/";
  // console.log("isLandingPage :>> ", isLandingPage);
  return (
    <html lang="ko" data-color-mode="light">
      <head>
        {/* Pretendard 웹폰트 CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        {/* Inter 웹폰트 CDN */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-100`}
        style={{ fontFamily: "Pretendard, Inter, sans-serif" }}
      >
        <MasterLayout>{children}</MasterLayout>
        {/* {isLandingPage ? children : <MasterLayout>{children}</MasterLayout>} */}
      </body>
    </html>
  );
}
