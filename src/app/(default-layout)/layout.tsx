import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

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
      <header>
        <div className="header-left">
          <Link href="/art">
            <div className="logo">MODIC</div>
          </Link>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="찾고 싶은 작품이 있나요?" />
          <span className="search-icon">&#128269;</span>
        </div>
      </header>
      <main className="absolute h-[calc(100vh-117px)] w-full overflow-y-auto">
        {children}
      </main>

      <footer className="absolute h-16">
        <div className="flex flex-row justify-center items-center h-full">
          <button className="basis-1/4 flex justify-center items-center">
            <Image src="/IconHome.svg" width={28} height={28} alt="홈" />
          </button>
          <button className="basis-1/4 flex justify-center items-center">
            <Image src="/IconMessage.svg" width={28} height={28} alt="메시지" />
          </button>
          <button className="basis-1/4 flex justify-center items-center">
            <Image
              src="/IconNotification.svg"
              width={28}
              height={28}
              alt="알림"
            />
          </button>
          <button className="basis-1/4 flex justify-center items-center">
            <Image src="/IconProfile.svg" width={28} height={28} alt="프로필" />
          </button>
        </div>
      </footer>
    </main>
  );
}
