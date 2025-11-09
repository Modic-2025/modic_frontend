// import { Navigation } from "swiper/modules";
import GetArt from "@/APIs/Art/GetArt";
import ArtDetailContent from "./ArtDetailContent";
import { cookies } from "next/headers";
import publicGetPost from "@/APIs/public/posts";
import { APIFailureMsg } from "@/APIs";
import { Art } from "@/types/Art";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const cookieStore = await cookies();
  const { art_id } = await params;
  const response: Art | APIFailureMsg = cookieStore.get("accessToken")?.value
    ? await GetArt(art_id)
    : await publicGetPost(art_id);

  if ("code" in response) {
    return (
      <>
        <p> {response.title}</p>
        <p>{response.desc}</p>
        <span>{response.code}</span>
      </>
    );
  }

  return <ArtDetailContent art={response} />;
};
export default Page;
