import { APIFailureMsg, DESC_401, TITLE_401 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

export const BUY_PERMISSION_TICKET_400 = "티켓이 부족합니다.";
export const BUY_PERMISSION_TICKET_404 = "해당 포스트를 찾을 수 없습니다."; // AI 페이지 진입해 있을 떄 게시글이 사라진 경우
// export const BUY_PERMISSION_TICKET_409 = "아직 이미지 생성 가능 횟수가 남아 있습니다."; // 남아있는 경우 UI 단에서 진입이 되지 않을 것 임으로 고려 안해도 됨
export const BUY_PERMISSION_TICKET_500 =
  "구매에 실패했습니다. 잠시 후 다시 시도해주세요"; // 일시적 서버 에러
const buyPermissionWithTicket = async (
  postId: number
): Promise<true | APIFailureMsg> => {
  const response = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/image-permissions/buy-with-ticket`,
    true,
    {
      body: JSON.stringify({
        postId: postId,
      }),
      method: "POST",
    }
  );
  const { status } = response;
  if (status === 200) {
    return true;
  }
  let failureMsg: APIFailureMsg = {
    code: status,
    title: "",
  };
  if (status === 400) {
    failureMsg = { ...failureMsg, title: BUY_PERMISSION_TICKET_400 };
  }
  if (status === 401) {
    failureMsg = { ...failureMsg, title: TITLE_401, desc: DESC_401 };
  }
  if (status === 404) {
    failureMsg = { ...failureMsg, title: BUY_PERMISSION_TICKET_404 };
  }
  if (status === 500) {
    failureMsg = { ...failureMsg, title: BUY_PERMISSION_TICKET_500 };
  }
  return failureMsg;
};

export default buyPermissionWithTicket;
