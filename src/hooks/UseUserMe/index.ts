import { UserMe } from "@/types/User";
import useSWR, { SWRResponse } from "swr";

const useUserMe = (token: string | null): SWRResponse<UserMe> => {
  return useSWR<UserMe>(
    token
      ? [`${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`, token]
      : null,
    async ([url, token]: [string, string]) => {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json() as Promise<UserMe>;
    }
  );
};

export default useUserMe;
