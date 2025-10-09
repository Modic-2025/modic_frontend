import { APIFailureMsg } from "@/APIs";
import { getRandomVote_serverSide } from "@/APIs/votes/random";
import { Vote } from "@/types/Vote";
import VoteContent from "./content";
import GetStreak from "@/APIs/votes/streak";

const VotePage = async () => {
  const vote: Vote | APIFailureMsg = await getRandomVote_serverSide();
  const { currentStreak, rewardThreshold } = await GetStreak();

  // in `APIFailureMsg` case
  if ("code" in vote) {
    const { code, title } = vote;
    return <>{`${title} (${code})`}</>;
  }
  return (
    <VoteContent
      vote={vote}
      streak={currentStreak}
      maxStreak={rewardThreshold}
    />
  );
};

export default VotePage;
