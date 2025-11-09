export type TypeChatUI = {
  // For UI
  isLoading?: boolean;
};
export type TypeChatData = {
  messageId: number; // loading 등의 fake message는 id를 -1로 설정
  messageOrder: number; // loading 등의 fake message는 id를 -1로 설정
  senderType: "AI" | "USER";
  textContent?: string;
  requestId: string;
  imageUrl?: string;
  createdAt: Date;
  status: "REQUEST" | "REQUEST_PENDING" | "REQUEST_FAILED" | "RESPONSE";
};

export type TypeChat = TypeChatUI & TypeChatData;
