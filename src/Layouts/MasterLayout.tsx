// 이 레이아웃은 모든 페이지에 동적으로 대응하는 레이아웃입니다.
import Footer from "./Footer";
import Header from "./Header";

const NO_FOOTER_PATHS = ["/ai/[art_id]", "/login"];

const MasterLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="absolute inset-x-0 mx-auto w-full max-w-sm min-h-screen bg-white shadow-lg p-0">
      <Header />
      <main className="absolute h-[calc(100vh-48px)] w-full overflow-y-auto px-[16px] pt-[12px] pb-14">
        {children}
      </main>
      <Footer excepts={NO_FOOTER_PATHS} />
    </main>
  );
};

export default MasterLayout;
