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

export const getUser = async (userId: string): Promise<User | null> => {
  if (!userId) {
    return null;
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles?userId=${userId}`
  );
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user info");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    throw new Error("Failed to load user info");
  }
  const user = custom_response.data;
  return user;
};
