"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { convertToRoutePattern } from ".";
import useNotificationCount from "@/hooks/UseNotificationCount";

// Footer 메뉴들의 constants
const MENUS = {
  HOME: "home",
  VOTE: "vote",
  MESSAGE: "message",
  // CREATE_ART: "create_art",
  NOTIFICATION: "notification",
  PROFILE: "profile",
} as const;
type MenuType = (typeof MENUS)[keyof typeof MENUS];

const NAV_BUTTONS: Array<NavButtonType> = [
  {
    value: MENUS.HOME,
    href: "/art",
    alt: "피드",
    selected: true,
    icon: "/IconHome.svg",
    selectedIcon: "/IconHomeSelected.svg",
  },
  // {
  //   value: MENUS.MESSAGE,
  //   href: "/message",
  //   alt: "메시지",
  //   selected: false,
  //   icon: "/IconMessage.svg",
  //   selectedIcon: "/IconMessageSelected.svg",
  // },
  {
    value: MENUS.VOTE,
    href: "/vote",
    alt: "티켓 파밍하기",
    selected: false,
    icon: "/vote.svg",
    selectedIcon: "/vote_selected.svg",
  },
  {
    value: MENUS.NOTIFICATION,
    href: "/notifications",
    alt: "알림",
    selected: false,
    icon: "/IconNotification.svg",
    selectedIcon: "/IconNotificationSelected.svg",
  },
  {
    value: MENUS.PROFILE,
    href: "/users/me",
    alt: "내 프로필",
    selected: false,
    icon: "/IconMyInfo.svg",
    selectedIcon: "/IconMyInfoSelected.svg",
  },
];

const findHrefByNAV_BUTTONS = (value: MenuType) => {
  return NAV_BUTTONS.find((item) => item.value === value)?.href;
};
const matchPathnameToTab = (pathname: string) => {
  switch (pathname) {
    case findHrefByNAV_BUTTONS(MENUS.HOME):
      return MENUS.HOME;
    case findHrefByNAV_BUTTONS(MENUS.VOTE):
      return MENUS.VOTE;
    case findHrefByNAV_BUTTONS(MENUS.MESSAGE):
      return MENUS.MESSAGE;
    case findHrefByNAV_BUTTONS(MENUS.NOTIFICATION):
      return MENUS.NOTIFICATION;
    case findHrefByNAV_BUTTONS(MENUS.PROFILE):
      return MENUS.PROFILE;
    default:
      return MENUS.HOME;
  }
};

// excepts: 랜더링 하지 않을 경로를 지정합니다.
const Footer = ({ excepts }: { excepts: string[] }) => {
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState<MenuType>(
    matchPathnameToTab(pathname)
  );
  const [navButtons, setNavButtons] =
    useState<Array<NavButtonType>>(NAV_BUTTONS);

  const { data: notiCount, mutate } = useNotificationCount();
  // Update `selectedTab` by current pathname
  useEffect(() => {
    if (pathname === "/notifications") {
      mutate();
    }
    setSelectedTab(matchPathnameToTab(pathname));
  }, [pathname]);

  if (
    excepts &&
    excepts.find((item) => item === convertToRoutePattern(pathname))
  )
    return null;

  return (
    <footer className="absolute h-14 w-full bottom-0 bg-white z-1">
      <div className="flex flex-row justify-center items-center h-full">
        {navButtons.map((navButton, i) => (
          <NavButton
            key={i}
            {...navButton}
            onClick={setSelectedTab}
            selected={navButton.value == selectedTab}
            showsBadge={
              navButton.value === "notification" ? Boolean(notiCount) : false
            }
          />
        ))}
      </div>
    </footer>
  );
};

type NavButtonType = {
  value: MenuType;
  href: string;
  alt: string;
  onClick?: (type: MenuType) => void;
  selected: boolean;
  icon: string;
  selectedIcon: string;
  showsBadge?: boolean;
};
const NavButton = ({
  value,
  href,
  alt,
  onClick,
  selected,
  icon,
  selectedIcon,
  showsBadge,
}: NavButtonType) => {
  const [_value, setValue] = useState<MenuType>(value);

  return (
    <Link
      href={href}
      className="basis-1/4 flex justify-center items-center cursor-pointer"
    >
      {showsBadge && (
        <span className="absolute rounded-full w-3 h-3 top-3 ml-4 bg-(--color-main) motion-preset-fade"></span>
      )}
      <button
        onClick={(e) => onClick && onClick(value)}
        className="w-full cursor-pointer"
      >
        <Image
          src={selected ? selectedIcon : icon}
          className="mx-auto"
          width={28}
          height={28}
          alt={alt}
        />
      </button>
    </Link>
  );
};

export default Footer;
