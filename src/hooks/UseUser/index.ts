import { getUser } from "@/APIs/profiles";
import useSWR from "swr";

const useUser = (userId: number) => {
  const searchParam = new URLSearchParams();
  searchParam.append("userId", userId.toString());
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles?${searchParam.toString()}`,
    async () => {
      const user = await getUser(userId);
      return user;
    }
  );
};

export default useUser;
