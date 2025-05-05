import useSWR from "swr";

const useArts = () => {
  return useSWR(
    "http://13.124.44.90:8080/api/posts?sort=LATEST&page=0&size=20",
    (url) => fetch(url).then((res) => res.json())
  );
};

export default useArts;
