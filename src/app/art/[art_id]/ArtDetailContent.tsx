"use client";
import BottomButton from "@/components/BottomButton";
import { Art } from "@/types/Art";
import MDEditor from "@uiw/react-md-editor";

const ArtDetailContent = ({ art }: { art: Art }) => {
  return (
    <>
      {/* 본문 */}
      <div className="px-4 py-4 pb-20 text-sm text-gray-700 leading-relaxed">
        <MDEditor.Markdown
          source={art.description}
          data-color-mode="light"
          // style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      {/* 컴포넌트 구조적 문제로 fixed 사용함, safari같은 브라우저의 경우 하단 스크롤 시 nav-bar에 이 버튼이 가려지는 현상 발생 */}
      <BottomButton href={`/art/ai/${art.postId}`}>작품 사용하기</BottomButton>
    </>
  );
};

export default ArtDetailContent;
