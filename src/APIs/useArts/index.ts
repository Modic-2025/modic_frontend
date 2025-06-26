import useSWR from "swr";

export type sortType = "LATEST" | "HOTTEST" | "FOLLOWING";

const useArts = (sort: sortType, page: number, size: number) => {
  return useSWR(
    `${process.env.API_HOST}:8080/api/posts/list?sort=${sort || "LATEST"}&page=${page || 0}&size=${size || 20}`,
    (url: string) => fetch(url).then((res) => res.json())
  );
};

export default useArts;
