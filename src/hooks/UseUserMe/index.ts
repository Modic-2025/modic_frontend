import useSWR from "swr";

const useUserMe = (token: string | null) => {
  return useSWR(
    token ? [`${process.env.API_HOST}/api/profiles/me`, token] : null,
    async ([url, token]: [string, string]) => {
      console.log("token :>> ", token);
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    }
  );
};

export default useUserMe;
