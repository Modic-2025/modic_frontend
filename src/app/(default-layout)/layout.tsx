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
      <header className="flex flex-row items-center gap-3 h-14 px-4 py-2 bg-white border-[#E8E8E8]">
        <div className="header-left">
          <Link href="/art">
            <Image
              src="/MODIC.svg"
              alt="MODIC"
              layout="relative"
              width={140}
              height={32}
            />
          </Link>
        </div>
        <div className="h-full w-full py-0.5">
          <div className="flex flex-row items-center justify-center h-full w-full bg-[#E8E8E8] rounded-lg pl-4 pr-2">
            <input
              type="text"
              className="w-full focus:outline-none"
              placeholder="찾고 싶은 작품이 있나요?"
            />
            <div className="cursor-pointer">
              <Image
                src="/Magnifyingglass.svg"
                alt="search"
                width={32}
                height={32}
              />
            </div>
          </div>
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
