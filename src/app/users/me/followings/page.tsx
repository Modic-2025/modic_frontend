import { getFollowingsMe } from "@/APIs/follows";
import FollowList from "@/components/Follow/List";
import { FollowUser } from "@/types/User";

const Page = async () => {
  return <FollowList mode="FOLLOWINGS_ME" />;
};

export default Page;
