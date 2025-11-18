import Slider from "@/components/Slider";
import MetaData from "./MetaData";
import { getUserMe } from "@/APIs/UserAPI";
import Tab, { UITab } from "@/components/Tab";
import GetArt from "@/APIs/Art/GetArt";
import DerivedArtTag from "@/components/Derived/Tag";
import { Art } from "@/types/Art";
import Link from "next/link";
import { cookies } from "next/headers";
import { APIFailureMsg } from "@/APIs";
import publicGetPost from "@/APIs/public/posts";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ art_id: number }>;
}) => {
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

  const { userId, postId, postStatus, title, images } = response;

  const user = await getUserMe();
  const isAuthor: boolean = Boolean(user && response.userId == user.userId);

  /**
   * UI datas
   */
  const tabs: Array<UITab> = [
    {
      name: "정보",
      href: `/${postId}`,
    },
    {
      name: "후기",
      href: `/${postId}/reviews`,
    },
    {
      name: "문의",
      href: `/${postId}/qnas`,
    },
  ];
  const isDerivedPost = postStatus.startsWith("DERIVED_");
  return (
    <>
      <Slider items={images} />
      <div className="flex items-center justify-between gap-1 py-4 border-b border-gray-200">
        <MetaData
          art={response}
          isAuthor={isAuthor}
          isLogined={Boolean(user)}
        />
      </div>

      {/* 제목 */}
      <div className="flex flex-col gap-1 py-3 border-b-4 border-[#F3F4F6]">
        <Link
          href={`/art/tree/${postId}`}
          className={`block rounded-full text-sm mr-1 underline text-(--color-gray-4)`}
        >
          2차 창작물 보기
        </Link>
        <h1 className="text-base text-lg font-bold">
          {isDerivedPost && <DerivedArtTag status={postStatus} />}
          {title}
        </h1>
      </div>

      <Tab tabs={tabs} />
      {children}
    </>
  );
};

export default layout;
