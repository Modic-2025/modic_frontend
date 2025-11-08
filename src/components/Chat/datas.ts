import { TypeChat } from "./types";

const NOW_LOADING_MSG = "응답 대기중 ..";
export const CHAT_ERROR_REFRESH: TypeChat = {
  messageId: -1,
  messageOrder: -1,
  senderType: "AI",
  textContent: NOW_LOADING_MSG,
  requestId: "", // must be setted
  createdAt: new Date(),
  isLoading: true,
  status: "RESPONSE",
};

export const CHAT_LOADING_MSG: TypeChat = {
  messageId: -1,
  messageOrder: -1,
  senderType: "AI",
  textContent: NOW_LOADING_MSG,
  requestId: "",
  createdAt: new Date(),
  isLoading: true,
  status: "RESPONSE",
};
