import { User, UserMe } from "@/types/User";

export const getUserMe = async (token: string): Promise<UserMe | null> => {
  if (!token) {
    // cancel request
    return null;
  }
  const res = await (
    await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

  const user = data;
  return user;
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
