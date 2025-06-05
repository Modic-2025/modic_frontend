"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // 'signup' or 'password'

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 2500);
    return () => clearTimeout(timeout);
  }, [router]);

  const title =
    from === "password"
      ? "비밀번호를 성공적으로 변경했어요!"
      : "회원가입을 성공적으로 완료했어요!";
  const subtitle = "곧 로그인 화면으로 이동합니다.";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 pt-8 pb-10">
      {/* 아이콘 */}
      <Image
        src="/done_1.svg"
        alt="완료"
        width={110}
        height={110}
        className="mb-8"
      />

      {/* 메인 메시지 */}
      <h1
        className="text-[20px] font-bold text-black text-center mb-2"
        style={{ fontFamily: "Pretendard" }}
      >
        {title}
      </h1>

      {/* 서브 메시지 */}
      <p
        className="text-[18px] font-medium text-[#9E9FAD] text-center"
        style={{ fontFamily: "Pretendard" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
