import Slider from "@/components/Slider";
import MetaData from "./MetaData";
import { cookies } from "next/headers";
import { getUserMe } from "@/APIs/UserAPI";
import Tab, { UITab } from "@/components/Tab";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ art_id: number }>;
}) => {
  console.log("params :>> ", await params);
  const { art_id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${art_id}`
  );
  const data_getPost = await res.json();
  const { status } = data_getPost;
  const artData = data_getPost.data;
  if (status != 200) {
    return <p> SERVER ERROR! ({status}) </p>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  const user = await getUserMe(token ? token.value : "");

  const isAuthor: boolean = Boolean(user && artData.userId == user.id);

  /**
   * UI datas
   */
  const tabs: Array<UITab> = [
    {
      name: "정보",
      href: `/art/${artData.id}`,
    },
    {
      name: "후기",
      href: `/art/${artData.id}/reviews`,
    },
    {
      name: "문의",
      href: `/art/${artData.id}/qnas`,
    },
  ];

  return (
    <>
      <Slider items={artData.images} />
      <div className="flex items-center justify-between gap-1 py-4 border-b-1 border-gray-200">
        <MetaData art={artData} isAuthor={isAuthor} isLogined={Boolean(user)} />
      </div>

      {/* 제목 */}
      <div className="py-3 border-b-4 border-[#F3F4F6]">
        <h1 className="text-base">{artData.title}</h1>
      </div>

      <Tab tabs={tabs} />
      {children}
    </>
  );
};

export default layout;
