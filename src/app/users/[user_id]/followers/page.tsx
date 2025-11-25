import FollowList from "@/components/Follow/List";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: { user_id: number } }) => {
  const cookieList = await cookies();
  const token = cookieList.get("accessToken");
  const { user_id } = params;
  return (
    <FollowList
      mode={token ? "FOLLOWERS_WITH_STATUS" : "FOLLOWERS"}
      userId={user_id}
    />
  );
};

export default Page;
