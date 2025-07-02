import ContentViewer from "@/components/ContentViewer";
import MasterLayout from "@/Layouts/MasterLayout";
import UserHeader from "../UserHeader";
import { HEADER_CONTENTS } from "@/Layouts";

const headerContents = [
  HEADER_CONTENTS.BACKWARD,
  HEADER_CONTENTS.TITLE,
  { ...HEADER_CONTENTS.OPTION_DOTTED, goTo: "/settings" },
];

const Page = async ({ params }: { params: Promise<{ user_id: number }> }) => {
  const { user_id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles?userId=${user_id}`,
    { method: "GET" }
  );
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user info");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    return <p> failed to load user {user_id}</p>;
  }
  const user = custom_response.data;
  return (
    <>
      <UserHeader user={user} />
      <section>
        <ContentViewer grid={2} />
      </section>
    </>
  );
};

export default Page;
