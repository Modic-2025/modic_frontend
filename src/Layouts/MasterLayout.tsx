"use client";
// 이 레이아웃은 모든 페이지에 동적으로 대응하는 레이아웃입니다.
// 차츰 모든 PATH에 대해서 대응시킬 예정입니다. (우선적으로 프로필, 마이프로필 페이지에만 적용)
import { useEffect, useState } from "react";
import Backward from "./components/Backward";
import Option from "./components/Option";
import Link from "next/link";
import Image from "next/image";

const getTitleFromPath = (path: string): string | null => {
  // /art/[hash]/chat 패턴 확인
  if (/^\/users\/[^\/]+\$/.test(path)) {
    return "";
  }

  return null;
};

// Options
type Option = {
  title?: string;
  noIcons?: boolean;
};

const MENUS = {
  HOME: "home",
  MESSAGE: "message",
  NOTIFICATION: "notification",
  PROFILE: "profile",
} as const;
type MenuType = (typeof MENUS)[keyof typeof MENUS];

const MasterLayout = ({
  children,
  option,
}: {
  children: React.ReactNode;
  option?: Option;
}) => {
  const [cWindow, setCWindow] = useState<Window | null>(null);
  const [selectedTab, setSelectedTab] = useState<MenuType>(MENUS.HOME);
  useEffect(() => {
    console.log("window :>> ", window);
    setCWindow(window);
  }, []);

  return (
    <main className="absolute inset-x-0 mx-auto w-full max-w-sm min-h-screen bg-white shadow-lg p-0">
      {!option?.noIcons && (
        <header className="h-11 flex flex-row items-center justify-between px-[16px] pt-[16px] bg-white">
          <Backward />
          <div className="w-full text-center">
            <h1 className="text-lg font-bold text-center">
              {option?.title
                ? option?.title
                : getTitleFromPath(cWindow && cWindow.location.pathname)}
            </h1>
          </div>
          <Option />
        </header>
      )}
      <main className="absolute h-[calc(100vh-44px)] w-full overflow-y-auto px-4 py-8 pb-[56px]">
        {children}
      </main>
      <footer className="absolute h-14 w-full h-[56px] bottom-0 bg-white">
        <div className="flex flex-row justify-center items-center h-full">
          <button className="basis-1/4 flex justify-center items-center">
            <Image
              src={
                selectedTab == MENUS.HOME
                  ? "/HomeMenuSelected.svg"
                  : "/IconHome.svg"
              }
              width={28}
              height={28}
              alt="홈"
            />
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
            <Link href="/users/me">
              <Image
                src={
                  selectedTab == MENUS.PROFILE
                    ? "/ProfileMenuSelected.svg"
                    : "/IconProfile.svg"
                }
                width={28}
                height={28}
                alt="프로필"
              />
            </Link>
          </button>
        </div>
      </footer>
    </main>
  );
};

export default MasterLayout;
