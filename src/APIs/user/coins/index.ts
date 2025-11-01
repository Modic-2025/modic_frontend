import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

type TypeResponseData = {
  coinBalance: number;
};
const getCoins = async (): Promise<number | APIFailureMsg> => {
  const response = await (
    await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/users/coins`, true)
  ).json();

  const { isSuccess } = response;
  if (!isSuccess) {
    const { status, message } = response;
    switch (status) {
      case 401:
        return {
          code: status,
          title: message,
        };
      case 500:
        return {
          code: status,
          title: message,
        };
      default:
        return { code: 500, title: TITLE_500 };
    }
  }
  const { data } = response;

  const { coinBalance }: TypeResponseData = data;

  return coinBalance;
};

export default getCoins;
