"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/Button/PrimaryButton";

const REGEX_NUMBER = /^[0-9]$/;

export default function EmailVerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);

  // 4자리 모두 입력 시 버튼 활성화
  const isComplete = code.every((digit) => digit !== "");

  const handleChange = (index: number, value: string) => {
    if (value && !REGEX_NUMBER.test(value)) {
      return;
    }
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // 한 글자만 유지
    setCode(newCode);
  };

  const handleNext = () => {
    console.log("입력된 인증코드:", code.join(""));
    // 다음 단계로 이동: 비밀번호 설정 페이지
    router.push("/signup/password");
  };

  return (
    <div className="flex flex-col justify-between w-full h-full px-6 pt-6 pb-5">
      {/* 본문 */}
      <div>
        {/* 타이틀 */}
        <div className="mb-2">
          <h2
            className="text-[24px] font-bold text-black mb-2"
            style={{ fontFamily: "Pretendard" }}
          >
            이메일 인증
          </h2>
          <p
            className="text-[16px] font-medium text-[#9E9FAD]"
            style={{ fontFamily: "Pretendard" }}
          >
            이메일로 전송된 인증번호를 입력해주세요.
          </p>
        </div>

        {/* 인증코드 입력칸 - 4자리 */}
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
                aspectRatio: "1 / 1",
                color: "#1A1B1E",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontWeight: 700,
                fontStyle: "normal",
                lineHeight: "normal",
              }}
            />
          ))}
        </div>

        {/* 안내 문구 */}
        <p
          className="mt-4 text-[12px] font-bold text-[#FF5100] underline cursor-pointer"
          style={{
            fontFamily: "Pretendard",
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationSkipInk: "auto",
            textDecorationThickness: "auto",
            textUnderlineOffset: "auto",
            textUnderlinePosition: "from-font",
          }}
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
