import useSWR from "swr";

type sortType = "LATEST" | "HOTTEST" | "NEWEST";

const useArts = (sort: sortType, page: number, size: number) => {
  return useSWR(
    `http://api.modic.kr:8080/api/posts/list?sort=${sort || "LATEST"}&page=${page || 0}&size=${size || 20}`,
    (url) => fetch(url).then((res) => res.json())
  );
};

export default useArts;
