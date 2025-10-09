import { APIFailureMsg } from "@/APIs";
import serverFetcher from "@/APIs/fetcher/ServerSide";
import clientFetcher from "@/APIs/fetcher/ServerSide";
import { Vote } from "@/types/Vote";

/**
{
  status: 200,
  data: {
    voteId: 1,
    originalImageUrl: 'https://cdn.modic.kr/post/7ff7c9fa-cb35-46be-8270-28dbc9db2242?Expires=1760001884&Signature=Prqu7Z46QBQBBfa42gT5otIJaRYGM4Uj~UfEpWOiOFIxqkmrNElfoa9yKjOkcA7SkcdW3vHm9jLfi40uqS1trr4J7ywUSxcNH5dbcs88NZeiQCMV823yvfTalNofBRETtIJteZy2uA7F0ubz9dhEUBlz0b-KHd050FPmdrDqKc48iVAl0Mx69zQp~6obINH5MhHFPA6ip4w6TIfHucvDUBJ5Et4zmvAYULcpR-AupRw4OMZoOdUDLG0rmU1XU1BWJEQE4DBIcOu3lLT1XkaBZtUIBA1EmnTrNSeJSbeChQqEUpyQzC6ZV12UaVfswPKdGdAO7XXO8qZIPKP-vjTRcQ__&Key-Pair-Id=K1QZP3Y49SA1WG',
    derivedImageUrl: 'https://cdn.modic.kr/generated-images/83e9bd0dc5ab48b7aebfd460bfc2b443.png?Expires=1760001884&Signature=PO957ci~fo52jd0gFj4g4-NWHUhfTeWm32GIMhxJ0xjFY58KxKY2lcLDW~xDUE4kSmS5A0uk89ztvneq71jahuW6ZkUk044MWujxOgBNCygINovr1dPhs4cMwG4~OyvrOOHnas1lcq6FLRTY83mSsZgF-IvUVttT3CsYL7FJlwrwK2zWaPa~-vuSRe~CyVqrO8v8gjspvo1nJOarCc0~7HMWTiAywOhnvlakXmSkwg0s0nZ6nNYbqIhjPu1jV36Q3XPyXxgGqP4hK9mIFApY6-nwzZ8IHtIU5T2KSHu6XUu14LgNiJAgFZ36-NONt93pN0u4LNofKifzKnnl1WDozw__&Key-Pair-Id=K1QZP3Y49SA1WG',
    approveWeight: 1,
    denyWeight: 0,
    totalWeight: 1,
    status: 'IN_PROGRESS'
  },
  isSuccess: true
}
 */
export const getRandomVote_serverSide: () => Promise<
  Vote | APIFailureMsg
> = async () => {
  const response = await (
    await serverFetcher(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/votes/random`,
      true
    )
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

export const getRandomVote_clientSide: () => Promise<
  Vote | APIFailureMsg
> = async () => {
  const response = await (
    await clientFetcher(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/votes/random`,
      true
    )
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
