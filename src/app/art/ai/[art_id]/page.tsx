import { APIFailureMsg } from "@/APIs";
import { TypeResponseData } from "@/APIs/posts/chat/messages/get/client";
import getChatMessages from "@/APIs/posts/chat/messages/get/server";
import Chat, { TypeChatData } from "@/components/Chat";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;

  const response: TypeResponseData | APIFailureMsg = await getChatMessages(
    art_id,
    -1,
    30
  );

  if ("code" in response && response.code !== 404) {
    // except 404, because chat UI need to be shown during 404 state
    switch (response.code) {
      case 400:
        return (
          <p>
            {response.title} ({response.code})
          </p>
        );
      default:
        return (
          <p>
            {response.title} ({response.code})
          </p>
        );
    }
  }

  const { content, page } = response as TypeResponseData;
  const chatHistory: TypeChatData[] = Array.isArray(content) ? content : [];

  return <Chat artId={art_id} chatHistory={chatHistory} page={page} />;
};

export default Page;
