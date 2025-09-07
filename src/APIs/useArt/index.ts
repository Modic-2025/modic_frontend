import useSWR from "swr";
import _fetch from "../fetcher/ClientSide";

const useArt = (id: number) => {
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${id}`,
    (url: string) =>
      _fetch(url, true).then(async (res) => (await res.json()).data)
  );
};

export default useArt;
