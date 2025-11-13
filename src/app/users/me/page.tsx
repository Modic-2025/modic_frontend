import UserHeader from "../UserHeader";
import ContentViewer from "@/components/ContentViewer";
import { getUserMe } from "@/APIs/UserAPI";
import PrimaryButton from "@/components/Button/PrimaryButton";
import Link from "next/link";
import { NO_POSTS } from "@/components/ContentViewer/placeholders";

const MyPage = async () => {
  const user = await getUserMe();
  if (!user) {
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

  return (
    <div className="flex flex-col h-full">
      <section>
        <UserHeader user={user} isAboutMe={true} />
      </section>
      <section className="h-full">
        <ContentViewer grid={2} showTabs={false} me={true}>
          <NO_POSTS />
        </ContentViewer>
      </section>
    </div>
  );
};

export default MyPage;
