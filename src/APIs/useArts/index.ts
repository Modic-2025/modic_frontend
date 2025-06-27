import useSWR from "swr";

export type sortType = "LATEST" | "HOTTEST" | "FOLLOWING";

const useArts = (sort: sortType, page: number, size: number) => {
  console.log(`${process.env.NEXT_PUBLIC_API_HOST}`);
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/list?sort=${sort || "LATEST"}&page=${page || 0}&size=${size || 20}`,
    (url: string) => fetch(url).then((res) => res.json())
  );
};

export default useArts;
