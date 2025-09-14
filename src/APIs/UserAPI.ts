import { User, UserMe } from "@/types/User";
import { getCookie } from "cookies-next";
import _fetch from "./fetcher/ServerSide";
import clientFetch from "./fetcher/ClientSide";

export const getUserMe = async (): Promise<UserMe | null> => {
  const res = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`,
    true
  );
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user me info");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    throw new Error("Failed to load user info");
  }
  const user = custom_response.data;
  return user;
};

export const getUserMe_client = async (): Promise<UserMe | null> => {
  const res = await clientFetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`,
    true
  );
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user me info");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    throw new Error("Failed to load user info");
  }
  const user = custom_response.data;
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
