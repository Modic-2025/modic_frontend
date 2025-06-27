"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PrimaryButton from "@/components/Button/PrimaryButton";

export default function PasswordSetupPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  const isPasswordValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,20}$/.test(
      password
    );

  const isMatch = password === confirmPassword;
  const isValid = isPasswordValid && isMatch;

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleSignup = async () => {
    if (!email || !name) {
      setError("잘못된 접근입니다. 이메일 또는 이름이 없습니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const result = await response.json();
      console.log("회원가입 응답:", result);

      if (result.isSuccess && result.status === 201) {
        router.push("/signup/success");
      } else if (result.status === 409) {
        setError("이미 가입된 이메일입니다.");
      } else {
        setError(result.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      setError("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full px-6 pt-6 pb-5">
      {/* 헤더 */}
      <div>
        <h2
          className="text-[24px] font-bold text-black mb-2"
          style={{ fontFamily: "Pretendard" }}
        >
          비밀번호 설정
        </h2>
        <p
          className="text-[16px] font-medium text-[#9E9FAD] mb-8"
          style={{ fontFamily: "Pretendard" }}
        >
          비밀번호를 설정해주세요.
        </p>

        {/* 비밀번호 입력 */}
        <div className="mb-[24px]">
          <label className="block text-[16px] font-bold text-black mb-2">
            비밀번호
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="w-full h-[58px] px-4 pr-10 rounded-[8px] bg-[#F3F4F6] text-[#1A1B1E] text-[16px] font-medium font-[Pretendard] placeholder-[#9E9FAD] focus:outline-none"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Image
                src={showPassword ? "/icon_close_eye.svg" : "/icon_eye.svg"}
                alt="비밀번호 보기"
                width={20}
                height={20}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 mt-2 min-h-[20px]">
            {password && !isPasswordValid ? (
              <>
                <Image
                  src="/alert-circle-filled.svg"
                  alt="경고"
                  width={13}
                  height={13}
                />
                <p
                  className="text-[#EB003B] text-[12px] font-medium"
                  style={{ fontFamily: "Pretendard" }}
                >
                  비밀번호는 영문, 숫자, 특수문자를 포함해 8~20자로
                  입력해주세요.
                </p>
              </>
            ) : (
              <p className="invisible text-[12px] font-medium">placeholder</p>
            )}
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-[49px]">
          <label className="block text-[16px] font-bold text-black mb-2">
            비밀번호 확인
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="w-full h-[58px] px-4 pr-10 rounded-[8px] bg-[#F3F4F6] text-[#1A1B1E] text-[16px] font-medium font-[Pretendard] placeholder-[#9E9FAD] focus:outline-none"
            />
            <button
              type="button"
              onClick={toggleConfirm}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Image
                src={showConfirm ? "/icon_close_eye.svg" : "/icon_eye.svg"}
                alt="비밀번호 보기"
                width={20}
                height={20}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 mt-2 min-h-[20px]">
            {confirmPassword && !isMatch ? (
              <>
                <Image
                  src="/alert-circle-filled.svg"
                  alt="경고"
                  width={13}
                  height={13}
                />
                <p
                  className="text-[#EB003B] text-[12px] font-medium"
                  style={{ fontFamily: "Pretendard" }}
                >
                  비밀번호가 일치하지 않습니다.
                </p>
              </>
            ) : (
              <p className="invisible text-[12px] font-medium">placeholder</p>
            )}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p
            className="text-[#EB003B] text-[12px] font-medium mb-4"
            style={{ fontFamily: "Pretendard" }}
          >
            {error}
          </p>
        )}
      </div>

      {/* 버튼 */}
      <div className="w-full">
        <PrimaryButton
          text={loading ? "가입 중..." : "가입하기"}
          disabled={!isValid || loading}
          onClick={handleSignup}
        />
      </div>
    </div>
  );
}
