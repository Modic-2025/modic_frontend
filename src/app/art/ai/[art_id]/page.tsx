import GetArt from "@/APIs/Art/GetArt";
import Chat from "@/components/Chat";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;

  return <Chat artId={art_id} />;
};

export default Page;
