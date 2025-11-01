import Slider from "@/components/Slider";
import MetaData from "./MetaData";
import { getUserMe } from "@/APIs/UserAPI";
import Tab, { UITab } from "@/components/Tab";
import GetArt from "@/APIs/Art/GetArt";
import DerivedArtTag from "@/components/Derived/Tag";
import { Art } from "@/types/Art";
import Link from "next/link";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ art_id: number }>;
}) => {
  const { art_id } = await params;
  const data_getPost = await GetArt(art_id);
  const { status } = data_getPost;
  const artData: Art = data_getPost.data;
  const { userId, postId, postStatus, images } = artData;
  if (status != 200) {
    return <p> SERVER ERROR! ({status}) </p>;
  }

  const user = await getUserMe();
  const isAuthor: boolean = Boolean(user && userId == user.userId);

  /**
   * UI datas
   */
  const tabs: Array<UITab> = [
    {
      name: "정보",
      href: `/art/${postId}`,
    },
    {
      name: "후기",
      href: `/art/${postId}/reviews`,
    },
    {
      name: "문의",
      href: `/art/${postId}/qnas`,
    },
  ];
  const isDerivedPost = postStatus.startsWith("DERIVED_");
  return (
    <>
      <Slider items={images} />
      <div className="flex items-center justify-between gap-1 py-4 border-b border-gray-200">
        <MetaData art={artData} isAuthor={isAuthor} isLogined={Boolean(user)} />
      </div>

      {/* 제목 */}
      <div className="py-3 border-b-4 border-[#F3F4F6]">
        <h1 className="text-base">
          <Link
            href={`/art/tree/${postId}`}
            className={`inline-block px-2 py-1 rounded-full text-sm font-bold mr-1 underline`}
          >
            2차 창작물 보기
          </Link>
          {isDerivedPost && <DerivedArtTag status={postStatus} />}
          {artData.title}
        </h1>
      </div>

      <Tab tabs={tabs} />
      {children}
    </>
  );
};

export default layout;
