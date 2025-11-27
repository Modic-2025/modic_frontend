// 이 레이아웃은 모든 페이지에 동적으로 대응하는 레이아웃입니다.
import Footer from "./Footer";
import Header from "./Header";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import "./layout.css";

const NO_FOOTER_PATHS = ["/art/ai/[art_id]", "/login", "/"];

const MasterLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="absolute inset-x-0 mx-auto w-full max-w-sm bg-white shadow-lg p-0 full-screen-wrapper">
      <Header />
      <main className="absolute h-[calc(100vh-48px-56px)] w-full overflow-y-auto px-4 pt-[12px] pb-4">
        {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID ?? ""}> */}
        {children}
        {/* </GoogleOAuthProvider> */}
      </main>
      <Footer excepts={NO_FOOTER_PATHS} />
    </main>
  );
};

export default MasterLayout;
