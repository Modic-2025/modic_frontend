"use client";
import { APIFailureMsg } from "@/APIs";
import VoteDecision from "@/APIs/votes/decisions";
import { getRandomVote_clientSide } from "@/APIs/votes/random";
import Fail from "@/components/Popups/Fail";
import VoteForm from "@/components/Vote";
import { Vote } from "@/types/Vote";
import { useEffect, useState } from "react";

const NEXT_VOTE_DURATION = 5000; // Time for move to next vote from result
const VoteContent = ({
  vote: _vote,
  streak: _streak,
  maxStreak,
}: {
  vote: Vote;
  streak: number;
  maxStreak: number;
}) => {
  /**
   * View state
   */
  const [view, setView] = useState<"DO_VOTE" | "RESULT">("DO_VOTE");

  /**
   * Vote state
   */
  const [vote, setVote] = useState<Vote>(_vote);
  const [streak, setStreak] = useState<number>(_streak);

  /**
   * Result state
   */
  const [isCorrect, setIsCorrect] = useState<undefined | boolean>(undefined);

  /**
   * Popups
   */
  const [showWarn, setShowWarn] = useState<boolean>(false);
  const [warnTitle, setWarnTitle] = useState<string>("");

  /**
   * Effects
   */
  useEffect(() => {
    if (view === "RESULT") {
      setTimeout(() => {
        // const newVote: Vote | APIFailureMsg = await getRandomVote_clientSide();
        // console.log("newVote :>> ", newVote);
        // setVote(newVote);
        setView("DO_VOTE");
      }, NEXT_VOTE_DURATION);
    }
  }, [view]);

  /**
   * Events
   */
  const onVote = async (response: boolean) => {
    const voteResponse = await VoteDecision(
      vote.voteId,
      response ? "APPROVE" : "DENY"
    );
    if ("code" in voteResponse) {
      const { code, title } = voteResponse;
      setWarnTitle(title);
      setShowWarn(true);
      return;
    }
    const { isCorrectAnswer, currentStreak } = voteResponse;
    setStreak(currentStreak);
    setIsCorrect(isCorrectAnswer);

    setView("RESULT");
  };

  return (
    <>
      {/**
       * Popups
       */}
      {showWarn && <Fail title={warnTitle} />}
      {/**
       * View
       */}
      {view === "DO_VOTE" ? (
        <VoteForm
          vote={vote}
          streak={streak}
          maxStreak={maxStreak}
          onVote={onVote}
        />
      ) : (
        <Result isCorrect={isCorrect} giveReward={streak === maxStreak} />
      )}
    </>
  );
};

const Result = ({
  isCorrect,
  giveReward,
}: {
  isCorrect: undefined | boolean;
  giveReward: boolean;
}) => (
  <>
    <p> {isCorrect ? "정답입니다!" : "틀렸습니다 .."} </p>
    <p>
      {" "}
      모딕 저작권 시스템의 판단에 의거하면, 이 그림은 원작과 비교하여 독립된
      저작권이 인정{isCorrect ? "되었습니다." : "되지 않았습니다."}
    </p>
    {giveReward ? (
      <p> 티켓 한 장이 지급되었습니다! </p>
    ) : (
      <p>
        {isCorrect
          ? "winning streak이 한 개 쌓였습니다!"
          : "winning streak이 삭제되었습니다 ㅠㅠ"}
      </p>
    )}
  </>
);

export default VoteContent;
