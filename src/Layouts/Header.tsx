"use client";

import Logo from "@/components/Layout/components/Header/Logo";
import {
  convertToRoutePattern,
  HEADER_CONTENTS,
  HeaderContentActionsType,
  HeaderContentType,
  SETTING_HEADER_CONTENTS,
} from ".";
import Backward from "@/components/Layout/components/Header/Backward";
import Title from "@/components/Layout/components/Header/Title";
import OptionLined from "@/components/Layout/components/Header/Option/lined";
import OptionDotted from "@/components/Layout/components/Header/Option/dotted";
import Coins from "@/components/Layout/components/Header/Coins";
import Tickets from "@/components/Layout/components/Header/Tickets";
import Search from "@/components/Layout/components/Header/Search";
import Close from "@/components/Layout/components/Header/Close";
import { JSX, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User, UserMe } from "@/types/User";

const getHeaderComponent = (
  content: HeaderContentType,
  index: number,
  actions?: HeaderContentActionsType
): JSX.Element => {
  switch (content) {
    case HEADER_CONTENTS.LOGO.value:
      return <Logo key={index} />;
    case HEADER_CONTENTS.BACKWARD.value:
      return <Backward key={index} />;
    case HEADER_CONTENTS.TITLE.value:
      return <Title key={index} specificValue={actions?.title.value} />;
    case HEADER_CONTENTS.OPTION_LINED.value:
      return <OptionLined key={index} goTo={actions?.option_lined.goTo} />;
    case HEADER_CONTENTS.OPTION_DOTTED.value:
      return <OptionDotted key={index} />;
    case HEADER_CONTENTS.COINS.value:
      return <Coins key={index} />;
    case HEADER_CONTENTS.TICKETS.value:
      return <Tickets key={index} />;
    case HEADER_CONTENTS.SEARCH.value:
      return <Search key={index} />;
    case HEADER_CONTENTS.CLOSE.value:
      return <Close key={index} backToPath={actions?.close.goTo || ""} />;
    default:
      return <></>;
  }
};

const Header = ({ user }: { user?: User | UserMe | null }) => {
  const [_user, setUser] = useState<User | null>(user ?? null);

  const pathName = usePathname();

  const headerContent =
    SETTING_HEADER_CONTENTS[convertToRoutePattern(pathName)];

  // actions를 통해 header 요소의 optional한 설정 세팅
  const actions = {
    ...headerContent?.actions,
    title: { value: user?.nickname || headerContent?.actions?.title?.value },
  };

  return (
    <header className="h-12 flex flex-row items-center justify-between px-[16px] pt-[16px] pb-[4px] bg-white">
      {headerContent?.elements?.map((item, i) =>
        getHeaderComponent(item, i, actions)
      )}
    </header>
  );
};

export default Header;
