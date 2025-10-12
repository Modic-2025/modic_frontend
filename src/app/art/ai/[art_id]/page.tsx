import { APIFailureMsg } from "@/APIs";
import GetArt from "@/APIs/Art/GetArt";
import getChatMessages from "@/APIs/posts/chat/messages/get/server";
import Chat, { TypeChatData } from "@/components/Chat";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;

  const response: TypeChatData[] | APIFailureMsg =
    await getChatMessages(art_id);
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

  let chatHistory: TypeChatData[] | undefined = undefined;
  if (Array.isArray(response)) {
    chatHistory = response.reverse();
  }

  return <Chat artId={art_id} chatHistory={chatHistory} />;
};

export default Page;
