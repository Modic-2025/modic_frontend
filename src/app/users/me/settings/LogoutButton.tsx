"use client";

import { APIFailureMsg } from "@/APIs";
import logout from "@/APIs/auth/logout";

const LogoutButton = () => {
  const onLogoutClick = async () => {
    const isSuccess: APIFailureMsg | boolean = await logout();
    if (typeof isSuccess !== "boolean") {
      alert(isSuccess.title);
      return;
    }

    window.location.replace("/login");
  };

  return (
    <li
      className="mb-2 text-(--color-point-red) cursor-pointer"
      onClick={onLogoutClick}
    >
      로그아웃
    </li>
  );
};

export default LogoutButton;
