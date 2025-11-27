"use client";
import { APIFailureMsg } from "@/APIs";
import VoteDecision, { VoteDecisionResponseData } from "@/APIs/votes/decisions";
import getRandomVote from "@/APIs/votes/random/client";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { AlertForm, CenteredLayout } from "@/components/Layout";
import Fail from "@/components/Popups/Fail";
import VoteForm from "@/components/Vote";
import Streak from "@/components/Vote/Streak";
import usePrevious from "@/hooks/UsePrevious";
import { Vote, VoteDecisions } from "@/types/Vote";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type TypeView = "DO_VOTE" | "RESULT" | "EXCEPTION";
type TypeVotePresentational = Vote & {
  view: TypeView;
};
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
   * Swiper state
   */
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);

  /**
   * Vote state
   */
  const [votes, setVotes] = useState<TypeVotePresentational[]>([
    { ..._vote, view: "DO_VOTE" },
  ]);
  const [voteException, setVoteException] = useState<
    APIFailureMsg | undefined
  >();
  const previousVotes: TypeVotePresentational[] = usePrevious(votes);
  const setViewOfCurrVote = async (view: TypeView) => {
    const temp = votes.map((vote, i) => ({
      ...vote,
      view: i === currentSlideIdx ? view : vote.view,
    }));
    await setVotes(temp);
  };
  const fetchNewVoteAndPush = async () => {
    const voteResponse: Vote | APIFailureMsg = await getRandomVote();
    if ("code" in voteResponse) {
      console.error("voteResponse", voteResponse);
      setVoteException(voteResponse);
      setVotes((prev) => [...votes, { ...prev[0], view: "EXCEPTION" }]);

      return;
    }
    setVotes([...votes, { ...voteResponse, view: "DO_VOTE" }]);
  };

  /**
   * VoteForm state
   * 마지막 decision을 저장합니다.
   * 이 값은 서버에서 내려주지 않는 label값을 위해 만들어졌으며 isCorrectAnswer과 대조하여  대체하여 사용됩니다.
   */
  const [lastDecision, setLastDecision] = useState<VoteDecisions | undefined>();

  /**
   * Result state
   */
  const [voteDecisionResult, setVoteDecisionResult] = useState<
    VoteDecisionResponseData | undefined
  >();
  const [streak, setStreak] = useState<number>(_streak);
  useEffect(() => {
    if (voteDecisionResult) {
      const { currentStreak } = voteDecisionResult;
      setStreak(currentStreak);
    }
  }, [voteDecisionResult]);

  /**
   * Popups
   */
  const [showWarn, setShowWarn] = useState<boolean>(false);
  const [warnTitle, setWarnTitle] = useState<string>("");

  /**
   * UI state (streak overlay)
   * - for shows give ticket UI
   */
  const [giveTicketUI, setGiveTicketUI] = useState<boolean>(false);
  const GIVE_TICKET_UI_DURATION = 3000; // Duration for turn back to streak UI

  /**
   * Effects
   */
  // Remove finished vote when new vote fetch & pushed
  // Apply timer for animation duration
  useEffect(() => {
    setTimeout(() => {
      if (1 <= currentSlideIdx) {
        const filteredResult = votes.filter((vote, i) => i >= votes.length - 1);
        setVotes(filteredResult);
      }
    }, 500);
  }, [currentSlideIdx]);

  // Catch finish current vote
  useEffect(() => {
    if (
      previousVotes &&
      votes &&
      previousVotes.length > 0 &&
      votes.length > 0 &&
      previousVotes[0].view === "DO_VOTE" &&
      votes[0].view === "RESULT"
    ) {
      // Fetch new vote
      fetchNewVoteAndPush();
    }
  }, [votes]);

  // Turn back to streak UI (automatically)
  useEffect(() => {
    setTimeout(() => {
      setGiveTicketUI(false);
    }, GIVE_TICKET_UI_DURATION);
  }, [giveTicketUI]);

  /**
   * Events
   */
  const onVote = async (decision: boolean) => {
    const safeDecision: VoteDecisions = decision ? "APPROVE" : "DENY";
    const voteResponse: VoteDecisionResponseData | APIFailureMsg =
      await VoteDecision(votes[currentSlideIdx].voteId, safeDecision);

    // Cache decision
    setLastDecision(safeDecision);

    if ("code" in voteResponse) {
      const { code, title } = voteResponse;
      setWarnTitle(title);
      setShowWarn(true);
      return;
    }

    // // FOR DEVELOP
    // const { isCorrectAnswer, currentStreak, receivedTicket } = {
    //   isCorrectAnswer: true,
    //   currentStreak: streak + 1 >= 3 ? 0 : streak + 1,
    //   receivedTicket: streak + 1 >= 3 ? true : false,
    // };
    // Save vote result
    const { currentStreak } = voteResponse;
    setVoteDecisionResult(voteResponse);
    setStreak(currentStreak);
    // setIsCorrect(isCorrectAnswer);

    // check ticket received
    // if user not received ticket, UI state to false
    // reason: to show streak directly in vote action
    // setGiveTicketUI(receivedTicket ? receivedTicket : false);

    // Change view of current vote
    setViewOfCurrVote("RESULT");
  };

  return (
    <>
      {/**
       * Popups
       */}
      {showWarn && (
        <Fail title={warnTitle} onCancel={() => setShowWarn(false)} />
      )}

      {/**
       * Streak overlay
       */}
      <div className="absolute bg-white w-[calc(100%-32px)] min-h-18 rounded-xl top-4 left-4 shadow-lg p-4 z-10">
        {voteDecisionResult?.receivedTicket ? (
          <div className="flex gap-4 motion-preset-fade motion-duration-750">
            <section className="basis-1/4">
              <Image
                src="/ticket.image.svg"
                alt="congrats!"
                className="motion-preset-confetti motion-duration-3000"
                // fill
                width={120}
                height={120}
              />
            </section>
            <section className="flex basis-3/4 font-bold items-center">
              축하드립니다! <br />
              무료 티켓이 지급되었습니다.
            </section>
          </div>
        ) : (
          <Streak value={streak} max={maxStreak} />
        )}
      </div>

      {/**
       * View
       */}
      <Swiper
        direction="vertical"
        pagination={{
          clickable: false,
        }}
        modules={[Pagination]}
        className="mySwiper h-full overflow-hidden"
        onSlideChange={(e) => setCurrentSlideIdx(e.activeIndex)}
      >
        {votes.map(({ view, ...rest }) => {
          let content: React.ReactNode;
          switch (view) {
            case "DO_VOTE":
              content = <VoteForm vote={rest} onVote={onVote} />;
              break;
            case "RESULT":
              content = voteDecisionResult ? (
                <ResultForm
                  voteDecisionResult={voteDecisionResult}
                  userVoteDecision={lastDecision}
                />
              ) : (
                <AlertForm title="투표 결과를 반영하는 중.." />
              );
              break;
            case "EXCEPTION":
              content = (
                <ExceptionForm voteException={voteException}>
                  <Link href="/users/me/created-images">
                    <PrimaryButton text="2차 창작물 등록하러 가기" />
                  </Link>
                </ExceptionForm>
              );
              break;
            default:
              content = <p>adf</p>;
          }
          return <SwiperSlide>{content}</SwiperSlide>;
        })}
      </Swiper>
    </>
  );
};

/**
 * Correct & label independent
 * Correct & label inherit
 * Wrong & label independent
 * Wrong & label inherit
 */

const ResultForm = ({
  voteDecisionResult,
  userVoteDecision,
}: {
  voteDecisionResult: VoteDecisionResponseData;
  userVoteDecision: VoteDecisions | undefined;
}) => {
  const { isCorrectAnswer, approveRate, denyRate } = voteDecisionResult;
  const booleanVoteDecision: boolean =
    userVoteDecision === "APPROVE" ? true : false;
  const isInheritCopyright =
    isCorrectAnswer !== undefined &&
    booleanVoteDecision !== undefined &&
    isCorrectAnswer !== booleanVoteDecision;
  return (
    <CenteredLayout>
      <>
        <AlertForm
          src={isCorrectAnswer ? "/done_1.svg" : `/alert_x.svg`}
          alt={isCorrectAnswer ? "정답" : "오답"}
          title={isCorrectAnswer ? "정답입니다!" : "틀렸습니다 .."}
          desc={`모딕 저작권 시스템의 판단에 의거하면, 이 그림은 원작과 비교하여 독립된
      저작권이 인정${isInheritCopyright ? "되지 않았습니다." : "되었습니다."}`}
        />
        <section className="flex flex-col gap-2">
          <RateBar value={approveRate} isActive={approveRate > denyRate}>
            예
          </RateBar>
          <RateBar value={denyRate} isActive={approveRate < denyRate}>
            아니오
          </RateBar>
        </section>
      </>
    </CenteredLayout>
  );
};
const RateBar = ({
  children,
  value,
  isActive = false,
}: {
  children: React.ReactNode;
  value: number;
  isActive?: boolean;
}) => (
  <div className="relative w-full h-16 rounded-2xl overflow-hidden bg-(--color-gray-2) text-lg">
    <span
      className={`flex flex-col items-start justify-center h-full ml-0 pl-4 ${isActive ? "bg-(--color-main)" : "bg-(--color-gray-4)"}`}
      style={{ width: `${Math.round(value)}%` }}
    ></span>
    <p className="absolute left-4 top-4.5 text-white font-bold">{children}</p>
    <span className="absolute right-4 top-4.5 text-(--color-gray-9) font-bold">
      {Math.round(value)}%
    </span>
  </div>
);

export const ExceptionForm = ({
  children,
  voteException,
}: {
  children?: React.ReactNode;
  voteException?: APIFailureMsg;
}) => (
  <CenteredLayout>
    <AlertForm
      src="/warning.svg"
      alt="EXCEPTION"
      title={voteException?.title || "에러가 발생하였습니다."}
      desc={voteException?.desc || ""}
    />
    {children}
  </CenteredLayout>
);

export default VoteContent;
