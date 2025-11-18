import { APIFailureMsg } from "@/APIs";
import { getRandomVote_serverSide } from "@/APIs/votes/random";
import { Vote } from "@/types/Vote";
import VoteContent, { ExceptionForm } from "./content";
import GetStreak from "@/APIs/votes/streak";
import Link from "next/link";
import PrimaryButton from "@/components/Button/PrimaryButton";

const VotePage = async () => {
  const vote: Vote | APIFailureMsg = await getRandomVote_serverSide();
  const { currentStreak, rewardThreshold } = await GetStreak();
  // in `APIFailureMsg` case
  if ("code" in vote) {
    return (
      <>
        <ExceptionForm voteException={vote}>
          <Link href="/users/me/created-images">
            <PrimaryButton text="2차 창작물 등록하러 가기" />
          </Link>
        </ExceptionForm>
      </>
    );
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
