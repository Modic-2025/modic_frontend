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
    <main className="absolute w-full max-w-sm min-h-screen bg-white mx-auto shadow-lg p-0">
      <main className="absolute h-[calc(100vh-117px)] w-full overflow-y-auto">
        {children}
      </main>
    </main>
  );
}
