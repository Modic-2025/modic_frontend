import { cookies } from "next/headers";

const _fetch = async (url: string, useAuth: boolean, options?: RequestInit) => {
  const _cookies = await cookies();
  return await fetch(url, {
    ...options,
    headers: {
      ...(useAuth && {
        Authorization: `Bearer ${_cookies.get("accessToken")?.value}`,
      }),
      "Content-Type": "application/json",
    },
  }).then((res) => res);
};

export default _fetch;
