"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/Button/PrimaryButton";

const REGEX_NUMBER = /^[0-9]$/;

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isComplete = code.every((digit) => digit !== "");

  const handleNext = async () => {
    const verificationCode = code.join("");

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://13.124.44.90:8080/api/auth/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const result = await res.json();
      console.log("🔐 인증번호 검증 응답:", result);

      if (!result.isSuccess || result.status !== 200) {
        setError("인증번호가 올바르지 않거나 만료되었습니다.");
        return;
      }

      router.push(`/signup/password?email=${encodeURIComponent(email!)}`);
    } catch (err) {
      console.error("❌ 인증번호 확인 실패:", err);
      setError("인증 처리 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value && !REGEX_NUMBER.test(value)) {
      return;
    }
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full px-6 pt-6 pb-5">
      <div>
        <h2 className="text-[24px] font-bold text-black mb-2" style={{ fontFamily: "Pretendard" }}>
          이메일 인증
        </h2>
        <p className="text-[16px] font-medium text-[#9E9FAD]" style={{ fontFamily: "Pretendard" }}>
          이메일로 전송된 인증번호를 입력해주세요.
        </p>

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

        {/* 🔁 안내 문구 (정적) */}
        <p
          className="mt-4 text-[12px] font-bold text-[#FF5100] underline"
          style={{ fontFamily: "Pretendard" }}
        >
          이메일을 받지 못하셨나요?
        </p>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-4 text-[12px] font-bold text-[#FF5100]" style={{ fontFamily: "Pretendard" }}>
            {error}
          </p>
        )}
      </div>

      <div className="w-full mt-auto">
        <PrimaryButton
          text={loading ? "요청 중..." : "다음"}
          disabled={!isComplete || loading}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
