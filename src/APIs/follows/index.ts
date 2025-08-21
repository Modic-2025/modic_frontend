import { FollowUser } from "@/types/User";
import _fetch from "../fetcher/ServerSide";
import { APIFailureMsg, APIFailureMsg_500 } from "..";

export const GET_FOLLOWS_TITLE_400 = "팔로잉 목록을 조회할 수 없었습니다.";
export const GET_FOLLOWS_DESC_400 = "잠시 후 다시 시도해주세요";

export const getFollowersMe = async (): Promise<
  APIFailureMsg | Array<FollowUser>
> => {
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/follows/followers/me`,
      true
    )
  ).json();

  const { status, data } = response;
  if (status === 200) return data.content;

  switch (status) {
    case 400:
      return {
        code: 404,
        title: GET_FOLLOWS_TITLE_400,
        desc: GET_FOLLOWS_DESC_400,
      };
  }
  return APIFailureMsg_500;
};

export const getFollowingsMe = async (): Promise<
  APIFailureMsg | Array<FollowUser>
> => {
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/follows/followings/me`,
      true
    )
  ).json();

  const { status, data } = response;
  if (status === 200) return data.content;

  switch (status) {
    case 400:
      return {
        code: 404,
        title: GET_FOLLOWS_TITLE_400,
        desc: GET_FOLLOWS_DESC_400,
      };
  }
  return APIFailureMsg_500;
};
