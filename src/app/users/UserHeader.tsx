import { User } from "@/types/User";
import Image from "next/image";

const UserHeader = ({ user }: { user: User }) => {
  console.log("user :>> ", user);
  return (
    <header className="mb-6">
      <div className="flex flex-row justify-between gap-6 mb-6 px-2">
        <div className="basis-1/4">
          <Image
            src="/temporary/anonymous.svg"
            alt="Profile image"
            width={128}
            height={128}
          />
        </div>
        <div className="basis-3/4">
          <p className="mb-2 font-bold text-[gray4]"> {user.email} </p>
          <ul className="flex flex-row gap-4 text-center">
            <li className="flex-1 mr-8">
              <p className="font-bold">{user.postCount}</p>
              <p className="">게시물</p>
            </li>
            <li className="flex-1 text-center">
              <p className="font-bold">{user.followerCount}</p>
              <p className="">팔로워</p>
            </li>
            <li className="flex-1 ml-8">
              <p className="font-bold">{user.followingCount}</p>
              <p className="">팔로잉</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-row w-full gap-2 font-bold">
        <button className="flex-1 py-1 rounded-lg bg-black text-white">
          팔로우
        </button>
        <button className="flex-1 py-1 rounded-lg border-gray1 border">
          메시지
        </button>
      </div>
    </header>
  );
};
export default UserHeader;
