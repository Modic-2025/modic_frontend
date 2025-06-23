"use client";
// 이 레이아웃은 모든 페이지에 동적으로 대응하는 레이아웃입니다.
// 차츰 모든 PATH에 대해서 대응시킬 예정입니다. (우선적으로 프로필, 마이프로필 페이지에만 적용)
import { useEffect, useState } from "react";
import Backward from "./components/Backward";
import Link from "next/link";
import Image from "next/image";
import useUserMe from "@/hooks/UseUserMe";
import Logo from "./components/Logo";
import OptionLined from "./components/Option/lined";
import OptionDotted from "./components/Option/dotted";
import Coins from "./components/Coins";
import Search from "./components/Search";
import Close from "./components/Close";
import { HEADER_CONTENTS, HeaderContent, HeaderContentType } from ".";
import Tickets from "./components/Tickets";

const getHeaderComponent = (content: HeaderContent, index: number) => {
  switch (content.value) {
    case HEADER_CONTENTS.LOGO.value:
      return <Logo key={index} />;
    case HEADER_CONTENTS.BACKWARD.value:
      return <Backward key={index} />;
    case HEADER_CONTENTS.OPTION_LINED.value:
      return <OptionLined key={index} />;
    case HEADER_CONTENTS.OPTION_DOTTED.value:
      return <OptionDotted key={index} />;
    case HEADER_CONTENTS.COINS.value:
      return <Coins key={index} />;
    case HEADER_CONTENTS.TICKETS.value:
      return <Tickets key={index} />;
    case HEADER_CONTENTS.SEARCH.value:
      return <Search key={index} />;
    case HEADER_CONTENTS.CLOSE.value:
      return <Close key={index} backToPath={content.backTo || ""} />;
    default:
      return <></>;
  }
};

// Options interface
// 추가 옵션들을 통해 레이아웃을 정립할 수 있음
type Option = {
  title?: string;
  noIcons?: boolean;
};

// Footer 메뉴들의 constants
const MENUS = {
  HOME: "home",
  MESSAGE: "message",
  CREATE_ART: "create_art",
  NOTIFICATION: "notification",
  PROFILE: "profile",
} as const;
type MenuType = (typeof MENUS)[keyof typeof MENUS];

const MasterLayout = ({
  children,
  option,
  headerContents,
}: {
  children: React.ReactNode;
  option?: Option;
  headerContents?: Array<HeaderContentType>;
}) => {
  const [cLocalStorage, setCLocalStorage] = useState<Storage | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<MenuType>(MENUS.HOME);
  const { user, error, isLoading } = useUserMe(accessToken);

  useEffect(() => {
    setCLocalStorage(localStorage);
  }, []);

  useEffect(() => {
    if (cLocalStorage) {
      setAccessToken(cLocalStorage.getItem("accessToken"));
    }
  }, [cLocalStorage]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <main className="absolute inset-x-0 mx-auto w-full max-w-sm min-h-screen bg-white shadow-lg p-0">
      {!option?.noIcons && (
        <header className="h-12 flex flex-row items-center justify-between px-[16px] pt-[16px] pb-[4px] bg-white">
          {headerContents?.map((content, i) => getHeaderComponent(content, i))}
        </header>
      )}
      <main className="absolute h-[calc(100vh-104px)] w-full overflow-y-auto px-[12px] py-[12px]">
        {children}
      </main>
      <footer className="absolute h-14 w-full h-[56px] bottom-0 bg-white">
        <div className="flex flex-row justify-center items-center h-full">
          <button className="basis-1/4 flex justify-center items-center cursor-pointer">
            <Link href={`/art`}>
              <Image
                src={
                  selectedTab == MENUS.HOME
                    ? "/IconHomeSelected.svg"
                    : "/IconHome.svg"
                }
                width={28}
                height={28}
                alt="홈"
              />
            </Link>
          </button>
          <button className="basis-1/4 flex justify-center items-center cursor-pointer">
            <Image src="/IconMessage.svg" width={28} height={28} alt="메시지" />
          </button>
          <button className="basis-1/5 flex justify-center items-center cursor-pointer">
            <Link href={`/art/create`}>
              <Image
                src="/IconCreateArt.svg"
                width={28}
                height={28}
                alt="메시지"
              />
            </Link>
          </button>
          <button className="basis-1/4 flex justify-center items-center cursor-pointer">
            <Image
              src={
                selectedTab == MENUS.NOTIFICATION
                  ? "/IconNotificationSelected.svg"
                  : "/IconNotification.svg"
              }
              width={28}
              height={28}
              alt="알림"
            />
          </button>
          <button className="basis-1/4 flex justify-center items-center cursor-pointer">
            <Link href="/users/me">
              <Image
                src={
                  selectedTab == MENUS.PROFILE
                    ? "/IconMyInfoSelected.svg"
                    : "/IconMyInfo.svg"
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
