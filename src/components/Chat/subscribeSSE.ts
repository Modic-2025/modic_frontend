import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { getCookie } from "cookies-next/client";
import { TypeChatData } from "./types";

/**
 * SSE를 구독합니다.
 * localStorage 에도 필요한 정보를 저장합니다.
 */
// 이 localStorage key는 `${prefix}_ARTID_${artId}`로 사용됩니다.
export const PREFIX_PENDING_USER_REQUEST_MESSAGE =
  "PENDING_USER_REQUEST_MESSAGE";
const subsSSE = async (
  artId: number,
  chatData: TypeChatData,
  onmessage: (e: EventSourceMessage) => void
) => {
  const token = getCookie("accessToken");
  subsRequest(artId, chatData);
  await fetchEventSource(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${artId}/chat/sse/${chatData.requestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      async onmessage(e) {
        await onmessage(e);
        unsubsRequest(artId);
      },
      signal: AbortSignal.timeout(5 * 60000),
    }
  );
};

const subsRequest = (artId: number, chatData: TypeChatData) => {
  localStorage.setItem(
    `${PREFIX_PENDING_USER_REQUEST_MESSAGE}_ARTID_${artId}`,
    JSON.stringify(chatData)
  );
};

const unsubsRequest = (artId: number) => {
  localStorage.removeItem(
    `${PREFIX_PENDING_USER_REQUEST_MESSAGE}_ARTID_${artId}`
  );
};

// Art id에 의한 현재 pending request를 가져옵니다.
export const getPendingReqById = (artId: number): string | null => {
  return localStorage.getItem(
    `${PREFIX_PENDING_USER_REQUEST_MESSAGE}_ARTID_${artId}`
  );
};

export default subsSSE;
