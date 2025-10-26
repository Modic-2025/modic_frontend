import { APIFailureMsg } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";
import { Vote } from "@/types/Vote";

const getRandomVote_clientSide: () => Promise<
  Vote | APIFailureMsg
> = async () => {
  const response = await (
    await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/votes/random`, true)
  ).json();
  console.log("response :>> ", response);

  const { status, data } = response;

  if (status === 200) return data;

  switch (status) {
    case 404:
      return { code: 404, title: "헐, 참여 가능한 투표가 없습니다." };
    default:
      return { code: 500, title: "서버에서 에러가 발생했습니다." };
  }
};

export default getRandomVote_clientSide;
