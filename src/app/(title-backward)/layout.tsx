"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getTitleFromPath = (pathname: string) => {
  // /art/[hash]/chat 패턴 확인
  if (/^\/art\/[^\/]+\/chat$/.test(pathname)) {
    return "이미지 생성하기";
  }

  // 다른 경로들 확인
  switch (pathname) {
    case "/art/regist":
      return "게시글 작성";
    default:
      return "MODIC"; // 기본 타이틀
  }
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(getTitleFromPath(pathname));
  }, [pathname]);

  return (
    <main className="absolute inset-x-0 mx-auto w-full max-w-sm min-h-screen bg-white shadow-lg p-0">
      <header className="h-11 flex items-center justify-between px-[16px] pt-[16px] bg-white">
        <div
          className="absolute cursor-pointer"
          onClick={() => window.history.back()}
        >
          <Image src="/icon_arrow_left.svg" alt="back" width={24} height={24} />
        </div>
        <div className="w-full text-center">
          <h1 className="text-lg font-bold text-center">{title}</h1>
        </div>
      </header>
      <main className="absolute h-[calc(100vh-58px)] w-full overflow-y-auto">
        {children}
      </main>
    </main>
  );
}
