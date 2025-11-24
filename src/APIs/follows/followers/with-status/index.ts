import { APIFailureMsg, APIFailureMsg_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ServerSide";
import { FollowUserWithStatus } from "@/types/User";
import { GET_FOLLOWS_DESC_400, GET_FOLLOWS_TITLE_400 } from "../..";

const GetFollowersWithStatus = async (): Promise<
  APIFailureMsg | FollowUserWithStatus[]
> => {
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/follows/followers/with-status`,
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

export default GetFollowersWithStatus;
