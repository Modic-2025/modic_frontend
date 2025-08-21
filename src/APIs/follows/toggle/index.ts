import { APIFailureMsg, DESC_500, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

export const TOGGLE_FOLLOW_TITLE_400 = "팔로우/팔로우 취소 할 수 없었습니다.";
export const TOGGLE_FOLLOW_DESC_400 = "잠시 후 다시 시도해주세요";
export const TOGGLE_FOLLOW_TITLE_404 = "존재하지 않는 유저입니다.";
export const TOGGLE_FOLLOW_DESC_404 = "이전 페이지로 이동합니다.";

// to follow: true, to unfollow: false
const followValue = "FOLLOW";
const unfollowValue = "UNFOLLOW";
const toggleFollowState = async (
  userId: number,
  state: boolean
): Promise<APIFailureMsg | true> => {
  const type = state ? followValue : unfollowValue;
  const queryParams = new URLSearchParams();
  queryParams.append("userId", `${userId}`);
  queryParams.append("type", type);
  const response = await await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/follows?${queryParams.toString()}`,
    true,
    {
      method: "POST",
    }
  );

  const { status } = response;
  if (status === 200) return true;
  switch (status) {
    case 400:
      return {
        code: status,
        title: TOGGLE_FOLLOW_TITLE_400,
        desc: TOGGLE_FOLLOW_DESC_400,
      };
    case 404:
      return {
        code: status,
        title: TOGGLE_FOLLOW_TITLE_404,
        desc: TOGGLE_FOLLOW_DESC_404,
      };
    default:
      return {
        code: 500,
        title: TITLE_500,
        desc: DESC_500,
      };
  }
};

export default toggleFollowState;
