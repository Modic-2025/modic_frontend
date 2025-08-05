import { getUserMe } from "@/APIs/UserAPI";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const Settings = async () => {
  const _cookies = await cookies();
  const me = await getUserMe(_cookies.get("accessToken")?.value || "");

  if (!me) {
  }

  return (
    <>
      <div className="py-6 flex gap-6 border-b border-(--color-gray-4)">
        <Image
          src="/temporary/anonymous.svg"
          alt="Profile image"
          className="basis-1/5"
          width={64}
          height={64}
        />
        <div className="basis-4/5 flex flex-col justify-center text-sm">
          <h1 className=" text-(--color-main) font-bold">{me?.nickname}</h1>
          <p className="text-(--color-gray-4)"> {me?.email} </p>
        </div>
      </div>
      <div className="mb-4"></div>
      <List>
        <Item href="/users/me/created-images" name="생성한 이미지 관리">
          <Image src="/icon-image.svg" alt="아이콘" width={24} height={24} />
        </Item>
      </List>
      <List>
        <Item href="/users/me/cash/withdrawal" name="수익 출금">
          <Image
            src="/cash-withdrawal.svg"
            alt="아이콘"
            width={24}
            height={24}
          />
        </Item>
        <Item href="/users/me/purchase" name="구매 내역">
          <Image src="/receipt.svg" alt="아이콘" width={24} height={24} />
        </Item>
      </List>
      <List>
        <Item href="/users/me/block-users" name="차단한 계정 관리">
          <Image src="/user-cancel.svg" alt="아이콘" width={24} height={24} />
        </Item>
      </List>
      <List>
        <Item href="/users/me/block-users" name="개인정보 처리방침">
          <Image
            src="/information-circle.svg"
            alt="아이콘"
            width={24}
            height={24}
          />
        </Item>
        <Item href="/users/me/block-users" name="이용 약관">
          <Image
            src="/information-circle.svg"
            alt="아이콘"
            width={24}
            height={24}
          />
        </Item>
      </List>

      <ul className="px-4">
        <li className="mb-2 text-(--color-point-red)">
          <Link href="/me/logout">로그아웃</Link>
        </li>
        <li>
          <Link href="/users/secession">회원 탈퇴</Link>
        </li>
      </ul>
    </>
  );
};

const List = ({ children }: { children: React.ReactNode }) => (
  <ul className="mb-4">{children}</ul>
);

const Item = ({
  children,
  href,
  name,
}: {
  children: React.ReactNode;
  href: string;
  name: string;
}) => (
  <li className="p-4">
    <Link href={href}>
      <div className="flex w-full gap-2">
        {children}
        <p className="basis-auto w-full">{name}</p>
        <Image src="/arrow-right.svg" alt="go" width={18} height={18} />
      </div>
    </Link>
  </li>
);

export default Settings;
