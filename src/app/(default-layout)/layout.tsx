import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

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
  description: "MODIC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} absolute antialiased bg-gray-100 min-h-screen flex flex-col items-center justify-center`}
    >
      <main className="absolute w-full max-w-sm min-h-screen bg-white mx-auto shadow-lg p-0">
        <header>
          <div className="header-left">
            <div className="logo">MODIC</div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="찾고 싶은 작품이 있나요?" />
            <span className="search-icon">&#128269;</span>
          </div>
        </header>
        <main className="absolute h-[calc(100vh-117px)] w-full overflow-y-auto">
          {children}
        </main>

        <footer className="absolute">
          <div className="footer-nav">
            <span className="icon">&#8962;</span>
            <span className="icon">&#10084;</span>
            <span className="icon">&#128100;</span>
          </div>
        </footer>
      </main>
    </body>
  );
}
