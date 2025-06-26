"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import PrimaryButton from "@/components/Button/PrimaryButton";

const REGEX_NUMBER = /^[0-9]$/;

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isComplete = code.every((digit) => digit !== "");
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (email && !hasSentRef.current) {
      console.log("📨 최초 이메일 인증 요청:", email);
      sendVerificationEmail(email);
      hasSentRef.current = true;
    }
  }, [email]);

  const sendVerificationEmail = async (targetEmail: string) => {
    try {
      const res = await fetch(
        `${process.env.API_HOST}:8080/api/auth/email/verification?type=sign-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: targetEmail }),
        }
      );

      const contentType = res.headers.get("Content-Type");
      let result = null;

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      }

      console.log("📥 인증번호 요청 응답:", result);

      if (!res.ok || (result && !result.isSuccess)) {
        const errorMsg = result?.message || `요청 실패: status ${res.status}`;
        setError(errorMsg);
        console.error("❌ 인증번호 요청 실패:", errorMsg);
      } else {
        console.log("✅ 인증번호 요청 성공");
      }
    } catch (err) {
      console.error("❌ 인증번호 요청 중 에러:", err);
      setError("이메일 인증 요청 중 문제가 발생했습니다.");
    }
  };

  const handleNext = async () => {
    const verificationCode = code.join("");

    try {
      setLoading(true);
      setError(null);

      console.log("🔐 인증번호 확인 요청:", { email, code: verificationCode });

      const res = await fetch(
        `${process.env.API_HOST}:8080/api/auth/email/verification/check?type=sign-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        }
      );

      const result = await res.json();
      console.log("📥 인증번호 검증 응답:", result);

      if (!res.ok || !result.isSuccess) {
        setError("인증번호가 올바르지 않거나 만료되었습니다.");
        return;
      }

      console.log("✅ 인증 성공, 다음 페이지로 이동");
      router.push(
        `/signup/password?email=${encodeURIComponent(email ?? "")}&name=${encodeURIComponent(name ?? "")}`
      );
    } catch (err) {
      console.error("❌ 인증번호 확인 실패:", err);
      setError("인증 처리 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("이메일 정보가 없습니다.");
      return;
    }

    try {
      console.log("📨 인증번호 재전송 요청:", email);
      setResending(true);
      setError(null);

      await sendVerificationEmail(email);
    } finally {
      setResending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value && !REGEX_NUMBER.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
  };

  return (
    <Suspense>
      <div className="flex flex-col justify-between w-full h-full px-6 pt-6 pb-5">
        <div>
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

          <div className="flex gap-[19px] mt-8">
            {code.map((digit, idx) => (
              <input
                key={idx}
                value={digit}
                maxLength={1}
                type="tel"
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

          <button
            className="mt-4 text-[12px] font-bold text-[#FF5100] underline"
            onClick={handleResend}
            disabled={resending}
            style={{ fontFamily: "Pretendard" }}
          >
            이메일을 받지 못하셨나요?
          </button>

          {error && (
            <p
              className="mt-4 text-[12px] font-bold text-[#FF5100]"
              style={{ fontFamily: "Pretendard" }}
            >
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
    </Suspense>
  );
}
