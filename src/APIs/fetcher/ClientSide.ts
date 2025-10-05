import { getCookie } from "cookies-next/client";

const _fetch = async (url: string, useAuth: boolean, options?: RequestInit) => {
  // const accessToken = localStorage.getItem("accessToken");
  const token = getCookie("accessToken");
  return await fetch(url, {
    ...options,
    headers: {
      ...(useAuth && {
        Authorization: `Bearer ${token}`,
      }),
      "Content-Type": "application/json",
    },
  });
};

export default _fetch;
