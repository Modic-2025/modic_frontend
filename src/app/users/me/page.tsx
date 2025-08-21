import UserHeader from "../UserHeader";
import ContentViewer from "@/components/ContentViewer";
import { cookies } from "next/headers";
import { getUserMe } from "@/APIs/UserAPI";
import PrimaryButton from "@/components/Button/PrimaryButton";
import Link from "next/link";

const MyPage = async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("accessToken")?.value || "";
  if (jwt === "") {
    return (
      <>
        <div className="flex h-full items-center flex-col justify-center text-center">
          <p className="text-center text-(--color-gray-8) my-8 text-[18px] font-bold">
            로그인 후 이용할 수 있는 기능입니다.
            <br />
            지금 로그인하시겠어요?
          </p>
          <Link href={`/login`} className="w-full cursor-pointer">
            <PrimaryButton text={"지금 로그인하기"} />
          </Link>
        </div>
      </>
    );
  }

  const user = await getUserMe(jwt);
  return (
    <>
      <UserHeader user={user} />
      <section>
        <ContentViewer grid={2} showTabs={false} me={true} />
      </section>
    </>
  );
};

export default MyPage;
