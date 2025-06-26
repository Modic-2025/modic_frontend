import useSWR from "swr";

const useArt = (id: number) => {
  return useSWR(`${process.env.API_HOST}/api/posts/${id}`, (url: string) =>
    fetch(url).then((res) => res.json())
  );
};

export default useArt;
