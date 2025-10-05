import { APIFailureMsg } from "@/APIs";
import { getRandomVote_serverSide } from "@/APIs/votes/random";
import VoteForm from "@/components/Vote";
import { Vote } from "@/types/Vote";
import VoteContent from "./content";

const VotePage = async () => {
  const vote: Vote | APIFailureMsg = await getRandomVote_serverSide();

  // in `APIFailureMsg` case
  if ("code" in vote) {
    const { code, title } = vote;
    return <>{`${title} (${code})`}</>;
  }
  console.log("vote :>> ", vote);
  // return <VoteContent />;
  return <VoteContent vote={vote} />;
};

export default VotePage;
