"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Footer 메뉴들의 constants
const MENUS = {
  HOME: "home",
  MESSAGE: "message",
  CREATE_ART: "create_art",
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
  {
    value: MENUS.MESSAGE,
    href: "/message",
    alt: "메시지",
    selected: false,
    icon: "/IconMessage.svg",
    selectedIcon: "/IconMessageSelected.svg",
  },
  {
    value: MENUS.CREATE_ART,
    href: "/art/regist",
    alt: "그림체 등록",
    selected: false,
    icon: "/IconCreateArt.svg",
    selectedIcon: "/IconCreateArt.svg",
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

const Footer = () => {
  const [selectedTab, setSelectedTab] = useState<MenuType>(MENUS.HOME);
  const [navButtons, setNavButtons] =
    useState<Array<NavButtonType>>(NAV_BUTTONS);

  const debugOnClick = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <footer className="absolute h-14 w-full bottom-0 bg-white z-1">
      <div className="flex flex-row justify-center items-center h-full">
        {navButtons.map((navButton, i) => (
          <NavButton
            key={i}
            {...navButton}
            onClick={setSelectedTab}
            selected={navButton.value == selectedTab}
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
};
const NavButton = ({
  value,
  href,
  alt,
  onClick,
  selected,
  icon,
  selectedIcon,
}: NavButtonType) => {
  const [_value, setValue] = useState<MenuType>(value);

  return (
    <Link
      href={href}
      className="basis-1/5 flex justify-center items-center cursor-pointer"
    >
      <button onClick={(e) => onClick(value)} className="w-full cursor-pointer">
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
