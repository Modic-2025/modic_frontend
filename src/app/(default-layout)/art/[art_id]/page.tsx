// import { Navigation } from "swiper/modules";
import Slider from "@/components/Slider";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;
  const res = await fetch(`http://api.modic.kr:8080/api/posts/${art_id}`);
  const data = await res.json();
  const { status } = data;
  console.log("data :>> ", data);
  const artData = data.data;
  console.log("artData :>> ", artData);
  if (status != 200) {
    return <p> SERVER ERROR! ({status}) </p>;
  }

  if (status == 200) {
    return (
      <>
        {/* 이미지영역 및 작가 */}
        <div className="px-4 pt-4">
          <Slider items={artData.images} />
          <div className="flex items-center justify-between pt-3 pb-3 border-b-1 border-gray-200">
            <div className="flex items-center">
              <Link href={`/users/${artData.userId}`}>
                <Image
                  src="/temporary/anonymous.svg"
                  alt="Profile image"
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
              </Link>
              <div>
                <div className="text-sm font-medium leading-tight">모디기</div>
                <div className="text-xs text-gray-400">@modicinic</div>
              </div>
            </div>
          </div>
        </div>

        {/* 제목 */}
        <div className="mt-2 mb-2 px-4">
          <h1 className="font-bold text-base">{artData.title}</h1>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex flex-row px-4 mt-3 border-b border-gray-200 text-sm font-medium">
          <button className="basis-1/3 pb-2 border-b-2 border-black mr-8">
            정보
          </button>
          <button className="basis-1/3 pb-2 text-gray-400 mr-8">후기</button>
          <button className="basis-1/3 pb-2 text-gray-400">문의</button>
        </div>

        {/* 본문 */}
        <div className="px-4 py-4 text-sm text-gray-700 leading-relaxed">
          {artData.description}
        </div>

        {/* 컴포넌트 구조적 문제로 fixed 사용함, safari같은 브라우저의 경우 하단 스크롤 시 nav-bar에 이 버튼이 가려지는 현상 발생 */}
        <div className="fixed bottom-14 left-0 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2">
          <Link href={`/art/${art_id}/chat`}>
            <button className="w-full py-3 bg-gray-900 text-white rounded-lg shadow cursor-pointer">
              <p className="font-bold">작품 사용하기</p>
            </button>
          </Link>
        </div>
      </>
    );
  }
};
export default Page;
