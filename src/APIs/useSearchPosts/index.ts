import useSWR from "swr";
import _fetch from "../fetcher/ClientSide";

const useSearchPosts = (
  keyword: string | null,
  page: number = 0,
  size: number = 20
) => {
  const shouldFetch = Boolean(keyword && keyword.trim().length > 0);

  return useSWR(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/search?keyword=${encodeURIComponent(keyword!)}&page=${page}&size=${size}`
      : null,
    (url: string) => _fetch(url, false).then((res) => res.json())
  );
};

export default useSearchPosts;
