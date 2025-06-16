// app/signup/layout.tsx
import type { Metadata } from "next";
import TopBarWrapper from "@/components/Navigation/TopBarWrapper";

export const metadata: Metadata = {
  title: "회원가입 - MODIC",
  description: "MODIC 회원가입 페이지입니다.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#F8F8F8]">
      <main className="relative w-full max-w-sm min-h-screen bg-white mx-auto shadow-lg">
        {/* 조건부 TopBar */}
        <TopBarWrapper />

        {/* TopBar 제외 영역 */}
        <div className="absolute top-[44px] bottom-0 w-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
