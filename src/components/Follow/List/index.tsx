import UserInfo from "@/components/UserInfo";
import FollowButton from "../Button";
import { FollowUser, User } from "@/types/User";
// import { useState } from "react";

const FollowList = ({
  users,
  onScrollEnd,
}: {
  users: FollowUser[];
  onScrollEnd: () => FollowUser[];
}) => {
  // const [_users, setUsers] = useState<FollowUser[]>(users);

  if (users.length <= 0) {
    return <p className="text-center"> 목록이 없습니다. </p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <Item key={user.userId} user={user} />
      ))}
    </ul>
  );
};

const Item = ({ user }: { user: FollowUser }) => (
  <li className="flex items-center py-4 border-b border-(--color-gray-1)">
    <div className="w-full">
      <UserInfo
        href={`/users/${user.userId}`}
        title={user.userName}
        desc={user.userEmail}
      />
    </div>
    <FollowButton state={false} />
  </li>
);

export default FollowList;
