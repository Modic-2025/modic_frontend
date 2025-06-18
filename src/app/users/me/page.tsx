import MasterLayout from "@/Layouts/MasterLayout";
import UserHeader from "../UserHeader";
import ContentViewer from "@/components/ContentViewer";
import { cookies } from "next/headers";
import { getUserMe } from "@/APIs/UserAPI";

const MyPage = async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("accessToken")?.value || "";

  if (jwt === "") {
    return (
      <MasterLayout
        option={{
          noIcons: true,
        }}
      >
        <p className="text-center text-gray-500 mt-10">
          로그인 후 이용할 수 있는 기능입니다.
          <br />
          지금 로그인하시겠어요?
        </p>
      </MasterLayout>
    );
  }

  const user = await getUserMe(jwt);

  return (
    <MasterLayout>
      <UserHeader user={user} />
      <section>
        <ContentViewer grid={2} />
      </section>
    </MasterLayout>
  );
};

export default MyPage;
