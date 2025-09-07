import { fetchEventSource } from "@microsoft/fetch-event-source";

export const subscribeAIRequestEvent = async (requestId: number) => {
  const token = localStorage.getItem("accessToken");

  return await fetchEventSource(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/sse/${requestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
