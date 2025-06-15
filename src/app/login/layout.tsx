// app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MODIC 로그인",
  description: "MODIC 로그인 페이지입니다.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex justify-center bg-[#F8F8F8]">
      <main className="w-full max-w-sm bg-white shadow-lg">
        <div className="min-h-screen flex flex-col">{children}</div>
      </main>
    </div>
  );
}
