// src/app/password/code/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/Button/PrimaryButton";

export default function PasswordRecoveryPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);

  // 4자리 모두 입력했는지 여부
  const isComplete = code.every((digit) => digit !== "");

  // 입력값 변경 핸들러
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // 한 글자만 유지
    setCode(newCode);
  };

  // 다음 버튼 클릭 시
  const handleNext = () => {
    console.log("입력된 인증코드:", code.join(""));
    router.push("/signup/password/reset"); // ← 경로 수정됨
  };

  return (
    <div className="flex flex-col justify-between w-full h-full px-6 pt-6 pb-5">
      {/* 타이틀 및 설명 */}
      <div>
        <div className="mb-2">
          <h2
            className="text-[24px] font-bold text-black mb-2"
            style={{ fontFamily: "Pretendard" }}
          >
            비밀번호 찾기
          </h2>
          <p
            className="text-[16px] font-medium text-[#9E9FAD]"
            style={{ fontFamily: "Pretendard" }}
          >
            비밀번호 재설정을 위해 이메일로 전송된 인증번호를 입력해주세요.
          </p>
        </div>

        {/* 인증코드 입력 */}
        <div className="flex gap-[19px] mt-8">
          {code.map((digit, idx) => (
            <input
              key={idx}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="rounded-[8px] text-center border-2 border-transparent focus:border-[#FF5100] focus:outline-none bg-[#F3F4F6]"
              style={{
                width: "58px",
                height: "58px",
                padding: "16px",
                color: "#1A1B1E",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontWeight: 700,
              }}
            />
          ))}
        </div>

        {/* 재전송 안내 */}
        <p
          className="mt-4 text-[12px] font-bold text-[#FF5100] underline cursor-pointer"
          style={{ fontFamily: "Pretendard" }}
          onClick={() => alert("이메일 재전송")}
        >
          이메일을 받지 못하셨나요?
        </p>
      </div>

      {/* 다음 버튼 */}
      <div className="w-full mt-auto">
        <PrimaryButton
          text="다음"
          disabled={!isComplete}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
