import Qna from "@/components/Qna";
import { FAKE_QNA_DATAS, Qna as QnaType } from "@/types/Qna";

const Content = ({ qnas = FAKE_QNA_DATAS }: { qnas: QnaType[] }) => {
  return (
    <>
      {qnas.map((qna) => (
        <div className="py-4 border-b-[0.5] border-(--color-gray-1)">
          <Qna key={qna.postId} {...qna} />
        </div>
      ))}
    </>
  );
};

export default Content;
