import { User, UserMe } from "@/types/User";

import serverFetch from "./fetcher/ServerSide";

export const getUserMe = async (): Promise<UserMe | null> => {
  const res = await (
    await serverFetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`,
      true
    )
  ).json();

  const { isSuccess, status, data } = res;
  if (!isSuccess) {
    switch (status) {
      case 401: // 만료됨?
        return null;
      default:
        return null;
    }
    // throw new Error("Failed to load user info");
  }

  return data;
};
