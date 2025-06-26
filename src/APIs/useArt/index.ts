import useSWR from "swr";

const useArt = (id: number) => {
  return useSWR(`${process.env.API_HOST}:8080/api/posts/${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );
};

export default useArt;
