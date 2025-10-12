import { APIFailureMsg } from "@/APIs";
import { ALERT_500_TEXT_TITLE } from "@/APIs/Art/Like";
import _fetch from "@/APIs/fetcher/ServerSide";
import { TypeChatData } from "@/components/Chat";

type TypeResponseData = {
  content: TypeChatData[];
};
const getChatMessages: (
  postId: number
) => TypeChatData[] | APIFailureMsg = async (postId: number) => {
  // fetch API
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${postId}/chat/messages`,
      true
    )
  ).json();
  const { status, data }: { status: number; data: TypeResponseData } = response;

  if (status !== 200) {
    switch (status) {
      case 400:
        return {
          code: status,
          title: "사용자 입력 오류[C-001]",
        };
      case 404:
        return {
          code: status,
          title: "AI 이미지 생성권을 구매한 이력이 없습니다.[AI-004]",
        };
      default:
        return { code: status, title: ALERT_500_TEXT_TITLE };
    }
  }
  const { content } = data;

  // refactor data
  const safeContent: TypeChatData[] =
    content &&
    content.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }));

  return safeContent;
};

export default getChatMessages;
