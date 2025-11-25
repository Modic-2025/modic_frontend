import { User } from "@/types/User";
import _fetch from "../fetcher/ClientSide";

export const getUser = async (userId: number): Promise<User | null> => {
  if (!userId) {
    return null;
  }
  const res = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles?userId=${userId}`,
    true
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
