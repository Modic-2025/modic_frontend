import _fetch from "@/APIs/fetcher/ClientSide";
import useSWR from "swr";

const UseCoins = () => {
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/users/coins`,
    async (url) => {
      return (await (await _fetch(url, true)).json()).data.coinBalance;
    }
  );
};

export default UseCoins;
