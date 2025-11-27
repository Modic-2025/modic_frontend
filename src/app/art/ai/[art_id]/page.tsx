import { APIFailureMsg } from "@/APIs";
import { TypeResponseData } from "@/APIs/posts/chat/messages/get/client";
import getChatMessages from "@/APIs/posts/chat/messages/get/server";
import Chat from "@/components/Chat";
import { TypeChatData } from "@/components/Chat/types";
import { AlertForm, CenteredLayout } from "@/components/Layout";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;

  const response = await getChatMessages(art_id, -1, 30);

  if ("code" in response && response.code !== 404) {
    // except 404, because chat UI need to be shown during 404 state
    return (
      <CenteredLayout>
        <AlertForm
          title={`${response.title} (${response.code})`}
          desc={response.desc}
        />
      </CenteredLayout>
    );
  }

  const { content, page } = response as TypeResponseData;
  const chatHistory: TypeChatData[] = Array.isArray(content) ? content : [];

  return <Chat artId={art_id} chatHistory={chatHistory} page={page} />;
};

export default Page;
