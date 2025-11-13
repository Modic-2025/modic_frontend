"use client";
import { APIFailureMsg } from "@/APIs";
import VoteDecision from "@/APIs/votes/decisions";
import getRandomVote from "@/APIs/votes/random/client";
import Fail from "@/components/Popups/Fail";
import VoteForm from "@/components/Vote";
import Streak from "@/components/Vote/Streak";
import usePrevious from "@/hooks/UsePrevious";
import { Vote } from "@/types/Vote";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

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
    console.log("voteResponse :>> ", voteResponse);
    if ("code" in voteResponse) {
      console.error("voteResponse", voteResponse);
      setVoteException(voteResponse);
      setVotes((prev) => [...votes, { ...prev[0], view: "EXCEPTION" }]);
      // switch (code) {
      //   case 404:
      //     break;
      //   default:
      // }
      return;
    }
    setVotes([...votes, { ...voteResponse, view: "DO_VOTE" }]);
  };
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
  const onVote = async (response: boolean) => {
    const voteResponse = await VoteDecision(
      votes[currentSlideIdx].voteId,
      response ? "APPROVE" : "DENY"
    );
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
    const { isCorrectAnswer, currentStreak, receivedTicket } = voteResponse;
    setStreak(currentStreak);
    setIsCorrect(isCorrectAnswer);

    // check ticket received
    // if user not received ticket, UI state to false
    // reason: to show streak directly in vote action
    setGiveTicketUI(receivedTicket ? receivedTicket : false);

    // Change view of current vote
    setViewOfCurrVote("RESULT");
  };

  console.log("votes :>> ", votes);

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
        {giveTicketUI ? (
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
        className="mySwiper h-[76vh] overflow-hidden"
        onSlideChange={(e) => setCurrentSlideIdx(e.activeIndex)}
      >
        {votes.map(({ view, ...rest }) => {
          let content: React.ReactNode;
          switch (view) {
            case "DO_VOTE":
              content = <VoteForm vote={rest} onVote={onVote} />;
              break;
            case "RESULT":
              content = <ResultForm isCorrect={isCorrect} />;
              break;
            case "EXCEPTION":
              content = <ExceptionForm voteException={voteException} />;
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

const FormLayout = ({
  src,
  alt,
  title,
  desc,
}: {
  src: string;
  alt: string;
  title: string;
  desc?: string;
}) => (
  <>
    <section>
      <Image src={src} alt={alt} width="100" height="100" className="m-auto" />
    </section>
    <section className="text-2xl font-bold">{title}</section>
    {desc && (
      <section className="font-bold text-(--color-gray-4)">{desc}</section>
    )}
  </>
);

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-full justify-center gap-4 text-center">
    {children}
  </div>
);

const ResultForm = ({ isCorrect }: { isCorrect: boolean | undefined }) => (
  <Layout>
    <FormLayout
      src={isCorrect ? "/done_1.svg" : `/alert_x.svg`}
      alt={isCorrect ? "정답" : "오답"}
      title={isCorrect ? "정답입니다!" : "틀렸습니다 .."}
      desc={`모딕 저작권 시스템의 판단에 의거하면, 이 그림은 원작과 비교하여 독립된
      저작권이 인정${isCorrect ? "되었습니다." : "되지 않았습니다."}`}
    />
  </Layout>
);

export const ExceptionForm = ({
  children,
  voteException,
}: {
  children?: React.ReactNode;
  voteException?: APIFailureMsg;
}) => (
  <Layout>
    <FormLayout
      src="/warning.svg"
      alt="EXCEPTION"
      title={voteException?.title || "에러가 발생하였습니다."}
      desc={voteException?.desc || ""}
    />
    {children}
  </Layout>
);

export default VoteContent;
