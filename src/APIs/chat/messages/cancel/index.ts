import { APIFailureMsg, TITLE_500, TypeResponse } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";
import { TypeChatData } from "@/components/Chat/types";

const cancelRequest = async (
  postId: number,
  cancelMessageId: number
): Promise<TypeChatData | APIFailureMsg> => {
  const response: TypeResponse<TypeChatData> = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${postId}/chat/messages/${cancelMessageId}/cancel`,
      true,
      {
        method: "POST",
      }
    )
  ).json();

  const { isSuccess } = response;

  if (!isSuccess) {
    const { status, message } = response;
    switch (status) {
      case 400:
        return {
          code: status,
          title: "메시지를 취소하지 못했습니다.",
          desc: message,
        };
      case 404:
        return {
          code: status,
          title: "해당 메시지는 이미 수행되었거나 찾을 수 없습니다.",
          desc: message,
        };
      default:
        return {
          code: 500,
          title: TITLE_500,
        };
    }
  }

  const { data } = response;

  return data;
};

export default cancelRequest;
