import FollowList from "@/components/Follow/List";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: Promise<{ user_id: number }> }) => {
  const cookieList = await cookies();
  const token = cookieList.get("accessToken");
  const { user_id } = await params;

  return (
    <FollowList
      mode={token ? "FOLLOWINGS_WITH_STATUS" : "FOLLOWINGS"}
      userId={user_id}
    />
  );
};

export default Page;
