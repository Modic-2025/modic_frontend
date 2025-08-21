"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/libs/axiosInstance";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { setCookie } from "cookies-next/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isActive = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive) return;

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", { email, password });
      const { accessToken } = res.data.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // FOR DEVELOP
        setCookie("accessToken", accessToken); // FOR DEVELOP
      }

      router.push("/art");
    } catch (err) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://api.modic.kr/oauth2/authorization/google";
  };

  const handleKakaoLogin = () => {
    window.location.href = "https://api.modic.kr/oauth2/authorization/kakao";
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center px-6">
      <h1
        className="text-[57.736px] font-[900] text-black mt-[120px] mb-[40px] text-center"
        style={{ fontFamily: "Inter" }}
      >
        MODIC
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[58px] px-[16px] rounded-[8px] border border-[#9E9FAD] bg-white text-black text-[18px] font-medium font-[Pretendard] placeholder-[#9E9FAD] focus:outline-none"
        />

        {/* 비밀번호 입력 */}
        <div className="relative w-full mt-[16px]">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[58px] px-[16px] pr-10 rounded-[8px] border border-[#9E9FAD] bg-white text-black text-[18px] font-medium font-[Pretendard] placeholder-[#9E9FAD] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Image
              src={showPassword ? "/icon_close_eye.svg" : "/icon_eye.svg"}
              alt="비밀번호 표시 전환"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* 로그인 버튼 */}
        <div className="mt-[24px] w-full">
          <PrimaryButton
            text={loading ? "로그인 중..." : "로그인"}
            disabled={!isActive || loading}
            onClick={() =>
              handleSubmit(new Event("submit") as unknown as React.FormEvent)
            }
          />
        </div>
      </form>

      {/* 비밀번호 찾기 / 회원가입 */}
      <div className="mt-[40px] mb-[48px] flex justify-center items-center gap-[8px] text-sm text-black font-sans">
        <button onClick={() => router.push("/signup/password/code")}>
          비밀번호 찾기
        </button>
        <div
          style={{ width: "0.5px", height: "14px", background: "#F3F4F6" }}
        />
        <button onClick={() => router.push("/signup")}>회원가입</button>
      </div>

      {/* 간편 로그인 */}
      <div className="w-full max-w-xs flex flex-col items-center">
        <div className="flex items-center w-full mb-[16px]">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-[#9E9FAD] text-[14px] font-[Pretendard]">
            간편 로그인
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-[44px] h-[44px] rounded-full bg-white border border-[#F3F4F6] flex items-center justify-center"
          >
            <Image
              src="/google-logo.svg"
              alt="Google 로그인"
              width={24}
              height={24}
            />
          </button>

          <button
            onClick={handleKakaoLogin}
            className="w-[44px] h-[44px] rounded-full bg-[#FEE500] flex items-center justify-center"
          >
            <Image
              src="/kakao-logo.svg"
              alt="Kakao 로그인"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
