"use client";
import Slider from "@/components/Slider";
import { Art } from "@/types/Art";
import { User } from "@/types/User";
import Image from "next/image";
import Link from "next/link";

const ArtDetailContent = ({ art, user }: { art: Art; user: User }) => {
  console.log("user :>> ", user);
  // const isAuthor = user && art.userId == user.id;
  const isAuthor = false;
  console.log("isAuthor :>> ", isAuthor);
  return (
    <>
      <Slider items={art.images} />
      <div className="flex items-center justify-between gap-1 py-4 border-b-1 border-gray-200">
        <div className="flex basis-3/10">
          <Link href={`/users/${art.userId}`} className="flex">
            <Image
              src="/temporary/anonymous.svg"
              alt="Profile image"
              width={32}
              height={32}
              className="rounded-full inline"
            />
            <span className="ml-[12px] inline">
              <div className="text-sm font-medium leading-tight">
                {art.userName}
              </div>
              <div className="text-xs text-gray-400">{art.userEmail}</div>
            </span>
          </Link>
        </div>
        {isAuthor ? (
          <button className="h-[24px] cursor-pointer basis-1/10">
            <Image
              src="/icon-grey-dotted.svg"
              alt="option"
              className="m-auto"
              width={18}
              height={18}
            />
          </button>
        ) : (
          <div className="flex basis-5/10 ml-auto text-center text-[12px]">
            <div className="ml-auto">
              <p className="font-bold"> {art.commercialPrice}코인 </p>
              <p className="text-[#989898]"> 상업적 </p>
            </div>
            <div className="ml-2">
              <p className="font-bold"> {art.nonCommercialPrice}코인 </p>
              <p className="text-[#989898]"> 비상업적 </p>
            </div>
            {user && (
              <button className="ml-4 cursor-pointer">
                <Image src="/Heart.svg" alt="like" width={24} height={24} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 제목 */}
      <div className="py-3 border-b-4 border-[#F3F4F6]">
        <h1 className="text-base">{art.title}</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex flex-row border-b border-gray-200 text-sm font-medium">
        <button className="basis-1/3 py-3 border-b-2 border-black">정보</button>
        <button className="basis-1/3 py-3 text-gray-400">후기</button>
        <button className="basis-1/3 py-3 text-gray-400">문의</button>
      </div>

      {/* 본문 */}
      <div className="px-4 py-4 text-sm text-gray-700 leading-relaxed">
        {art.description}
      </div>

      {/* 컴포넌트 구조적 문제로 fixed 사용함, safari같은 브라우저의 경우 하단 스크롤 시 nav-bar에 이 버튼이 가려지는 현상 발생 */}
      <div className="fixed bottom-14 left-0 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2">
        <Link href={`/art/${art.id}/chat`}>
          <button className="w-full py-3 bg-gray-900 text-white rounded-lg shadow cursor-pointer">
            <p className="font-bold">작품 사용하기</p>
          </button>
        </Link>
      </div>
    </>
  );
};

export default ArtDetailContent;
