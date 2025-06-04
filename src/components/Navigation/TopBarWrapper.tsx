"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";

export default function TopBarWrapper() {
  const pathname = usePathname();

  // success 페이지에선 TopBar 숨김
  if (pathname.startsWith("/signup/success")) {
    return null;
  }

  return <TopBar />;
}
