import { APIFailureMsg } from "@/APIs";
import { ALERT_500_TEXT_TITLE } from "@/APIs/Art/Like";
import _fetch from "@/APIs/fetcher/ClientSide";
import { VoteDecisions } from "@/types/Vote";

type TypeResponseData = {
  voteId: number;
  isCorrectAnswer: boolean;
  currentStreak: number;
  receivedTicket: boolean;
};
const VoteDecision: (
  id: number,
  decision: VoteDecisions
) => Promise<TypeResponseData | APIFailureMsg> = async (
  id: number,
  decision: VoteDecisions
) => {
  const http = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/votes/${id}/decisions`,
    true,
    {
      method: "POST",
      body: JSON.stringify({
        decision,
      }),
    }
  );

  const { status, data }: { status: number; data: TypeResponseData } =
    await http.json();

  if (status !== 200) {
    switch (status) {
      case 400:
        return {
          code: status,
          title: "일일 투표 한도를 초과했습니다.",
        };
      case 403:
        return {
          code: status,
          title: "투표 권한이 없습니다.",
        };
      case 404:
        return {
          code: status,
          title: "해당 투표는 방금 끝났습니다.",
        };
      case 500:
        return {
          code: status,
          title: ALERT_500_TEXT_TITLE,
        };
    }
  }

  return data;
};

export default VoteDecision;
