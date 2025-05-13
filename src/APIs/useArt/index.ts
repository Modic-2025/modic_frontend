import useSWR from "swr";

const useArt = (id: number) => {
  return useSWR(`http://13.124.44.90:8080/api/posts/${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );
};

export default useArt;
