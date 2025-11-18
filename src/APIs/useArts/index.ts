import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import _fetch from "../fetcher/ClientSide";
import { Art_thumbnail } from "@/types/Art";
import { TypePaging } from "@/types";

export type sortType = "LATEST" | "HOTTEST" | "FOLLOWING";

// FOR DEVELOP
// SWR의 fetcher(with token)를 설정해 주기 위해 개발용 함수입니다.
export const fetchWithToken = async ([url]: [string]) => {
  return await _fetch(url, true).then((res) => res.json());
};

export type ArtPagingData = TypePaging & { content: Art_thumbnail[] };
const useArts = (
  sort: sortType | null,
  page: number,
  size: number,
  infKeyGetter: (
    index: number,
    previousPageData: ArtPagingData | null
  ) => string | null,
  userId?: number
) => {
  const shouldFetch = Boolean(sort);
  if (typeof userId === "number") {
    if (userId === -1) {
      // get by me
      return useSWRInfinite<ArtPagingData>(
        [
          shouldFetch
            ? `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me/posts?page=${page || 0}&size=${size || 20}`
            : null,
        ],
        fetchWithToken
      );
    }
    // get by user
    return useSWRInfinite<ArtPagingData>(
      shouldFetch
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/posts?userId=${userId}&page=${page || 0}&size=${size || 20}`
        : null,
      (url: string) => _fetch(url, false).then((res) => res.json())
    );
  }

  return useSWRInfinite<ArtPagingData>(infKeyGetter, (url: string) =>
    _fetch(url, false).then((res) => res.json().then((_res) => _res.data))
  );
};

export default useArts;
