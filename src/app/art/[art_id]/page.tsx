// import { Navigation } from "swiper/modules";
import Slider from "@/components/Slider";
import MasterLayout, { defaultHeaderContents } from "@/Layouts/MasterLayout";
import Image from "next/image";
import Link from "next/link";
import ArtDetailContent from "./ArtDetailContent";
import { getUserMe } from "@/APIs/UserAPI";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${art_id}`
  );
  const data_getPost = await res.json();
  const { status } = data_getPost;
  console.log("data_getPost :>> ", data_getPost);
  const artData = data_getPost.data;
  console.log("artData :>> ", artData);
  if (status != 200) {
    return <p> SERVER ERROR! ({status}) </p>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  const data_getUserMe = await getUserMe(token ? token.value : "");
  console.log("data_getUserMe :>> ", data_getUserMe);
  const user = data_getUserMe;

  if (status == 200) {
    return (
      <MasterLayout headerContents={defaultHeaderContents}>
        <ArtDetailContent art={artData} user={user} />
      </MasterLayout>
    );
  }
};
export default Page;
