import UserInfo from "@/components/UserInfo";
import { Art } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";

const MetaData = ({
  art,
  isAuthor,
  isLogined,
}: {
  art: Art;
  isAuthor: boolean;
  isLogined: boolean;
}) => {
  return (
    <>
      <UserInfo
        title={art.userName}
        desc={art.userEmail}
        href={`/users/${art.userId}`}
      />
      {/* <AuthorProfile art={art} /> */}
      {isAuthor ? (
        <button className="h-[24px] cursor-pointer basis-1/10">
          <Image
            src="/icon-grey-dotted.svg"
            alt="option"
            className="m-auto"
            width={18}
            height={18}
          />
        </button>
      ) : (
        <div className="flex basis-5/10 ml-auto text-center text-[12px]">
          <div className="ml-auto">
            <p className="font-bold"> {art.commercialPrice}코인 </p>
            <p className="text-[#989898]"> 상업적 </p>
          </div>
          <div className="ml-2">
            <p className="font-bold"> {art.nonCommercialPrice}코인 </p>
            <p className="text-[#989898]"> 비상업적 </p>
          </div>
          {isLogined && (
            <button className="ml-4 cursor-pointer">
              <Image src="/Heart.svg" alt="like" width={24} height={24} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

const AuthorProfile = ({ art }: { art: Art }) => {
  return (
    <>
      <div className="flex basis-3/10">
        <Link href={`/users/${art.userId}`} className="flex">
          <Image
            src="/temporary/anonymous.svg"
            alt="Profile image"
            width={32}
            height={32}
            className="rounded-full inline"
          />
          <span className="ml-[12px] inline">
            <div className="text-sm font-medium leading-tight">
              {art.userName}
            </div>
            <div className="text-xs text-gray-400">{art.userEmail}</div>
          </span>
        </Link>
      </div>
    </>
  );
};

const Coins = () => {};

export default MetaData;
