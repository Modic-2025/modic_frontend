import useSWR from "swr";
import _fetch from "../fetcher/ClientSide";

export type sortType = "LATEST" | "HOTTEST" | "FOLLOWING";

// FOR DEVELOP
// SWR의 fetcher(with token)를 설정해 주기 위해 개발용 함수입니다.
export const fetchWithToken = async ([url, token]: [string, string]) =>
  await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

const useArts = (
  sort: sortType,
  page: number,
  size: number,
  userId?: number, // number -1 for own(session) arts
  authToken?: string // FOR DEVELOP
) => {
  if (typeof userId === "number") {
    if (userId === -1) {
      // get by me
      return useSWR(
        [
          `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me/posts?page=${page || 0}&size=${size || 20}`,
          authToken,
        ],
        fetchWithToken
      );
    }
    // get by user
    return useSWR(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/posts?userId=${userId}&page=${page || 0}&size=${size || 20}`,
      (url: string) => _fetch(url, false).then((res) => res.json())
    );
  }
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts?sort=${sort || "LATEST"}&page=${page || 0}&size=${size || 20}`,
    (url: string) => fetch(url).then((res) => res.json())
  );
};

export default useArts;
