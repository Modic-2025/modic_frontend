import { Vote } from "@/types/Vote";
import GrayButton from "../Button/GrayButton";

const VoteForm = ({
  vote,
}: {
  vote?: Vote;
  onVote?: (response: boolean) => void; // true: "YES", false: "NO"
}) => {
  return (
    <div className="flex flex-col h-full items-center text-center">
      <div>
        <h1 className="font-bold text-lg">
          {" "}
          두 그림은 같은 작가가 그렸을까요?{" "}
        </h1>
        <p className="text-(--color-gray-4)"> 예, 아니오 중 선택 해주세요 </p>
        <section className="flex flex-row">
          <div className="flex-1/2">
            <h2>A</h2>
            {/* <Image  /> */}
          </div>
          <div className="flex-1/2">
            <h2>B</h2>
            {/* <Image /> */}
          </div>
        </section>
        <section>
          <GrayButton>예</GrayButton>
          <GrayButton>아니오</GrayButton>
        </section>
      </div>
    </div>
  );
};

export default VoteForm;
