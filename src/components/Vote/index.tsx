import { Vote } from "@/types/Vote";
import Image from "next/image";
import ClickableImage from "../ClickableImage";

const VoteForm = ({
  vote,
  onVote,
}: {
  vote: Vote;
  onVote?: (response: boolean) => void; // true: "YES", false: "NO"
}) => {
  const { derivedImageUrl, originalImageUrl } = vote;

  return (
    <div className="flex flex-col h-full justify-center text-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <ul>
            <li></li>
          </ul>
        </div>
        <h1 className="font-bold text-lg">
          {" "}
          두 그림은 같은 작가가 그렸을까요?{" "}
        </h1>
        <p className="text-(--color-gray-4)"> 예, 아니오 중 선택 해주세요 </p>
        <section className="flex flex-row min-h-36 gap-2">
          <div className="flex-1/2">
            {/* <h2>A</h2> */}
            <div className="absolute w-43 h-36 rounded-xl overflow-hidden">
              <ClickableImage
                src={originalImageUrl}
                alt={originalImageUrl}
                fill
              />
              {/* <Image src={originalImageUrl} alt={originalImageUrl} fill /> */}
            </div>
          </div>
          <div className="flex-1/2">
            {/* <h2>B</h2> */}
            <div className="absolute w-43 h-36 rounded-xl overflow-hidden">
              <ClickableImage
                src={derivedImageUrl}
                alt={derivedImageUrl}
                fill
              />
              {/* <Image src={derivedImageUrl} alt={derivedImageUrl} fill /> */}
            </div>
          </div>
        </section>
        <section>
          <SecondaryButton onClick={() => onVote && onVote(true)}>
            예
          </SecondaryButton>
          <SecondaryButton onClick={() => onVote && onVote(false)}>
            아니오
          </SecondaryButton>
        </section>
      </div>
    </div>
  );
};

const SecondaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="block w-full min-h-12 bg-(--color-gray-2) rounded-md mb-2 font-bold cursor-pointer"
  >
    {children}
  </button>
);

export default VoteForm;
