import _fetch from "@/APIs/fetcher/ClientSide";

// 400 (own, 생략)
// 401
export const ALERT_401_TEXT_TITLE = "로그인 세션이 만료되었습니다.";
export const ALERT_401_TEXT_DESC = "로그인 페이지로 이동합니다.";
// 404
export const ALERT_404_TEXT_TITLE = "해당 게시글을 찾을 수 없습니다.";
export const ALERT_404_TEXT_DESC = "피드로 이동합니다.";
// 500
export const ALERT_500_TEXT_TITLE = "게시글을 좋아요 할 수 없었습니다.";
export const ALERT_500_TEXT_DESC = "잠시 후 다시 시도해주세요";

// return value
// true: success, false: failure
export const LikeArt = async (artId: number): Promise<boolean | number> => {
  const res = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${artId}/like`,
    true,
    {
      method: "POST",
    }
  );
  const { status } = res;
  if (status === 200) return true;

  return status;
};
