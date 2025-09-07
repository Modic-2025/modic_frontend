import _fetch from "@/APIs/fetcher/ClientSide";
import { getCookie } from "cookies-next";
import useSWR from "swr";

const useRemainGens = (postId: number) => {
  const shouldFetch = postId && typeof postId === "number" && postId > 0;
  const searchParams = new URLSearchParams();
  if (shouldFetch) {
    searchParams.append("postId", postId.toString());
  }
  return useSWR(
    shouldFetch
      ? [`remaining-generations`, postId]
      : // ? `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/image-permissions/remaining-generations?${searchParams.toString()}`
        null,
    shouldFetch
      ? ([, postId]: [url: string, postId: number]) =>
          _fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/image-permissions/remaining-generations?postId=${postId}`,
            true
          ).then(async (res) => {
            const { status, isSuccess, code, remainingGenerations } =
              await res.json();
            if (status === 404) return 0;
            return remainingGenerations;
          })
      : null
  );
};

export default useRemainGens;
