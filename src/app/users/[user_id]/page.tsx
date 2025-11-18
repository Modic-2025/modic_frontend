import ContentViewer from "@/components/ContentViewer";
import UserHeader from "../UserHeader";
import { HEADER_CONTENTS } from "@/Layouts";
import { User } from "@/types/User";
import _fetch from "@/APIs/fetcher/ServerSide";
import { NO_POSTS } from "@/components/ContentViewer/placeholders";

const headerContents = [
  HEADER_CONTENTS.BACKWARD,
  HEADER_CONTENTS.TITLE,
  { ...HEADER_CONTENTS.OPTION_DOTTED, goTo: "/settings" },
];

const Page = async ({ params }: { params: Promise<{ user_id: string }> }) => {
  const { user_id } = await params;
  let safeUserId = -1;
  try {
    safeUserId = Number(user_id);
  } catch (e) {
    console.error(
      `Path '/users/[user_id]' 에서 user_id를 number 형으로 변환하지 못했습니다.\nuser_id: ${user_id}, safeUserId: ${safeUserId}`
    );
  }
  const res = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles?userId=${safeUserId}`,
    false
  );
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user info");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    return <p> failed to load user {safeUserId}</p>;
  }
  const user: User = { ...custom_response.data, id: safeUserId };
  return (
    <>
      <UserHeader user={user} except={["coin"]} />
      <section>
        <ContentViewer grid={2} userId={safeUserId}>
          <NO_POSTS />
        </ContentViewer>
      </section>
    </>
  );
};

export default Page;
