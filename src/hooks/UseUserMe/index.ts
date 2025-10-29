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
      const response = await res.json();
      // API 응답이 {isSuccess, status, data} 구조인 경우 data 추출
      return response.data as UserMe;
    }
  );
};

export default useUserMe;
