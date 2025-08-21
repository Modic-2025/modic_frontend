// (presentational component)
// 유저의 프로필 레이아웃 중 중복되는 것을 컴포넌트로 빼두었습니다.

import Image from "next/image";
import Link from "next/link";

type CommonProp = {
  title: string;
  desc?: string;
  src?: string;
};

type UserInfoProp = CommonProp & {
  href?: string;
  className?: string;
};

const UserInfo = (prop: UserInfoProp) => (
  <div className={`flex ${prop.className || ""}`}>
    {prop.href ? (
      <Link href={prop.href || "#"} className="flex">
        <Commons {...prop} />
      </Link>
    ) : (
      <Commons {...prop} />
    )}
  </div>
);

const Commons = ({ title, desc, src }: CommonProp) => (
  <>
    <Image
      src={src || "/temporary/anonymous.svg"}
      alt="Profile"
      width={48}
      height={48}
      className="rounded-full inline"
    />
    <span className="inline-flex flex-col justify-center ml-[12px] h-[48px]">
      <p className="text-[16px] font-bold leading-tight mb-1">{title}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </span>
  </>
);

export default UserInfo;
