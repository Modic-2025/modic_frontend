import FollowList from "@/components/Follow/List";

const Page = async ({ params }: { params: { user_id: number } }) => {
  const { user_id } = params;

  return <FollowList mode="FOLLOWINGS" userId={user_id} />;
};

export default Page;
