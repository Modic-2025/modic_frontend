import VoteForm from "@/components/Vote";
import { Vote } from "@/types/Vote";

const VoteContent = ({ vote }: { vote: Vote }) => {
  return (
    <>
      <VoteForm vote={vote} />
    </>
  );
};

export default VoteContent;
