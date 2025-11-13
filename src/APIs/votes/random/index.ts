import { APIFailureMsg } from "@/APIs";
import serverFetcher from "@/APIs/fetcher/ServerSide";
import { Vote } from "@/types/Vote";

export const getRandomVote_serverSide: () => Promise<
  Vote | APIFailureMsg
> = async () => {
  const response = await (
    await serverFetcher(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/votes/random`,
      true
    )
  ).json();

  const { status, data } = response;

  if (status === 200) return data;

  switch (status) {
    case 404:
      return { code: 404, title: "참여할 수 있는 투표가 없습니다." };
    default:
      return { code: 500, title: "서버에서 에러가 발생했습니다." };
  }
};
