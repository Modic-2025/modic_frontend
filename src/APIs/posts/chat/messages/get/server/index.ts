import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ServerSide";
import { TypeChatData } from "@/components/Chat/types";

export const sortChatMsg = (datas: TypeChatData[]) => {
  const ary = [...datas].sort((a, b) => a.messageOrder - b.messageOrder);
  return ary;
};

type TypeResponseData = {
  page: number;
  content: TypeChatData[];
};
const getChatMessages: (
  postId: number,
  _page: number,
  size: number
) => Promise<TypeResponseData | APIFailureMsg> = async (
  postId: number,
  _page: number,
  size: number
) => {
  const param = new URLSearchParams();
  param.append("page", _page.toString());
  param.append("size", size.toString());
  // fetch API
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${postId}/chat/messages?${param.toString()}`,
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
        return { code: status, title: TITLE_500 };
    }
  }
  const { content, page } = data;

  // refactor data
  const safeContent: TypeChatData[] = sortChatMsg(
    content
      ? content.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
      : []
  );
  return {
    page,
    content: safeContent,
  };
};

export default getChatMessages;
