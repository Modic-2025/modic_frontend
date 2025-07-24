// import { Navigation } from "swiper/modules";
import GetArt from "@/APIs/Art/GetArt";
import ArtDetailContent from "./ArtDetailContent";
import { getUserMe } from "@/APIs/UserAPI";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;
  const data_getPost = await GetArt(art_id);
  const { status } = data_getPost;
  const artData = data_getPost.data;
  if (status != 200) {
    return <p> SERVER ERROR! ({status}) </p>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  const user = await getUserMe(token ? token.value : "");

  return <ArtDetailContent art={artData} user={user} />;
};
export default Page;
