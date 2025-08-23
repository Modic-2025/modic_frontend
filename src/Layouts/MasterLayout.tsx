// 이 레이아웃은 모든 페이지에 동적으로 대응하는 레이아웃입니다.
import { getUser, getUserMe } from "@/APIs/UserAPI";
import Footer from "./Footer";
import Header from "./Header";
import { cookies } from "next/headers";

const NO_FOOTER_PATHS = ["/art/ai/[art_id]"];

const MasterLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  let user = null;
  if (token) {
    user = getUserMe(token);
  }
  return (
    <main className="absolute inset-x-0 mx-auto w-full max-w-sm min-h-screen bg-white shadow-lg p-0">
      <Header user={user} />
      <main className="absolute h-[calc(100vh-48px)] w-full overflow-y-auto px-[16px] py-[12px] pb-[132px]">
        {children}
      </main>
      <Footer excepts={NO_FOOTER_PATHS} />
    </main>
  );
};

export default MasterLayout;
