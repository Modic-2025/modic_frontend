import { getFollowersMe } from "@/APIs/follows";
import FollowList from "@/components/Follow/List";
import { FollowUser } from "@/types/User";

const Page = async () => {
  const users = await getFollowersMe();
  const safeUsers: FollowUser[] = Array.isArray(users) ? users : [];
  const fetchUsers = () => {
    return [];
  };

  return <FollowList users={safeUsers} onScrollEnd={fetchUsers} />;
};

export default Page;
