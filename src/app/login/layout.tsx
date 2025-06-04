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
    <html lang="ko">
      <body>
        <main className="absolute w-full max-w-sm min-h-screen bg-white mx-auto shadow-lg p-0">
          <div className="h-full w-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
