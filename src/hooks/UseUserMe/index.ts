import useSWR from "swr";

const useUserMe = (token: string | null) => {
  return useSWR(
    token
      ? [`${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`, token]
      : null,
    async ([url, token]: [string, string]) => {
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    }
  );
};

export default useUserMe;
