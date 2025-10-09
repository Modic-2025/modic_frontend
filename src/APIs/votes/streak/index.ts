import _fetch from "@/APIs/fetcher/ServerSide";

type TypeResponseData = {
  currentStreak: 0;
  rewardThreshold: 0;
};
const GetStreak: () => Promise<TypeResponseData> = async () => {
  const response = await (
    await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/votes/streak`, true)
  ).json();

  const { status, data }: { status: number; data: TypeResponseData } = response;
  if (status !== 200) {
    throw new Error("No session in get vote streak");
  }
  return data;
};

export default GetStreak;
