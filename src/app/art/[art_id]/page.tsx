// import { Navigation } from "swiper/modules";
import Slider from "@/components/Slider";
import Link from "next/link";

const Page = async ({ params }: { params: { art_id: string } }) => {
  // const res = await fetch(
  //   `https://api.artic.edu/api/v1/artworks/${params.art_id}?fields=id,title,artist_display,artwork_type_title,date_display,medium_display,dimensions,exhibition_history,artist_title,image_id`
  // );
  // const data = await res.json();
  // const art = data.data;

  return (
    <>
      {/* 이미지영역 및 작가 */}
      <div className="px-4 pt-4">
        <Slider />
        <div className="flex items-center justify-between pt-3 pb-3 border-b-1 border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
            <div>
              <div className="text-sm font-medium leading-tight">모디기</div>
              <div className="text-xs text-gray-400">@modicinic</div>
            </div>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <div className="mt-2 mb-2 px-4">
        <h1 className="font-bold text-base">
          올해의 히트작, ㅇㅇㅇㅇ 웹툰 사용 그림체!
        </h1>
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
        이 웹툰에서 사용된 독창적인 스타일을
        <br />
        기반으로 한 작품체이고 개성 넘치는 그림체입니다.
        <br />
        <br />
        여러 스타일로 변주하거나 2차 창작을 생성하게 표현하는 디테일한 화풍이
        특징입니다.
        <br />
        <br />
        해당 화풍이 궁금하거나 해당 화풍 스타일로 표현해보고 싶으시다면, 아래의
        버튼을 눌러 작품 사용하기를 진행해 보세요! 이 웹툰에서 사용된 독창적인
        스타일을
        <br />
        기반으로 한 작품체이고 개성 넘치는 그림체입니다.
        <br />
        <br />
        여러 스타일로 변주하거나 2차 창작을 생성하게 표현하는 디테일한 화풍이
        특징입니다.
        <br />
        <br />
        해당 화풍이 궁금하거나 해당 화풍 스타일로 표현해보고 싶으시다면, 아래의
        버튼을 눌러 작품 사용하기를 진행해 보세요! 이 웹툰에서 사용된 독창적인
        스타일을
        <br />
        기반으로 한 작품체이고 개성 넘치는 그림체입니다.
        <br />
        <br />
        여러 스타일로 변주하거나 2차 창작을 생성하게 표현하는 디테일한 화풍이
        특징입니다.
        <br />
        <br />
        해당 화풍이 궁금하거나 해당 화풍 스타일로 표현해보고 싶으시다면, 아래의
        버튼을 눌러 작품 사용하기를 진행해 보세요! 이 웹툰에서 사용된 독창적인
        스타일을
        <br />
        기반으로 한 작품체이고 개성 넘치는 그림체입니다.
        <br />
        <br />
        여러 스타일로 변주하거나 2차 창작을 생성하게 표현하는 디테일한 화풍이
        특징입니다.
        <br />
        <br />
        해당 화풍이 궁금하거나 해당 화풍 스타일로 표현해보고 싶으시다면, 아래의
        버튼을 눌러 작품 사용하기를 진행해 보세요!
      </div>

      {/* 컴포넌트 구조적 문제로 fixed 사용함, safari같은 브라우저의 경우 하단 스크롤 시 nav-bar에 이 버튼이 가려지는 현상 발생 */}
      <div className="fixed bottom-14 left-0 w-full max-w-sm p-4 left-1/2 transform -translate-x-1/2">
        <Link href={`/art/${params.art_id}/chat`}>
          <button className="w-full py-3 bg-gray-900 text-white rounded-lg shadow cursor-pointer">
            <p className="font-bold">작품 사용하기</p>
          </button>
        </Link>
      </div>
    </>
  );
};
export default Page;
