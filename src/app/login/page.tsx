"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PrimaryButton from "@/components/Button/PrimaryButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const isActive = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("email:", email);
    console.log("password:", password);
    // TODO: 로그인 처리 API 연결
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center px-6">
      {/* 로고 */}
      <h1
        className="text-[57.736px] font-[900] text-[#292929] mt-[120px] mb-20 text-center"
        style={{ fontFamily: "Inter" }}
      >
        MODIC
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="이메일을 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[48px] rounded-md border border-gray-300 px-4 text-sm placeholder-[#7A7A7A] font-sans"
          style={{ fontFamily: "Inter, sans-serif" }}
        />

        {/* 비밀번호 입력 */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[48px] rounded-md border border-gray-300 px-4 pr-10 text-sm placeholder-[#7A7A7A] font-sans"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Image
              src={showPassword ? "/icon_close_eye.svg" : "/icon_eye.svg"}
              alt="toggle password"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* 로그인 상태 유지 & 비밀번호 찾기 */}
        <div className="flex justify-between w-full text-xs text-[#7A7A7A] font-sans mt-1 mb-4">
          <label className="flex items-center gap-1">
            <input type="checkbox" className="accent-black w-[14px] h-[14px]" />
            로그인 상태 유지
          </label>
          <button
            onClick={() => router.push("/signup/password/code")}
            className="underline"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 로그인 버튼 */}
        <PrimaryButton text="로그인" disabled={!isActive} onClick={() => {}} />
      </form>

      {/* 소셜 로그인 */}
      <div className="w-full max-w-xs flex flex-col gap-3 mt-8">
        <button className="flex items-center justify-center h-[48px] rounded-md bg-[#FEE500] text-black font-semibold">
          <Image src="/kakao.svg" alt="kakao" width={20} height={20} className="mr-2" />
          카카오톡으로 로그인
        </button>
        <button className="flex items-center justify-center h-[48px] rounded-md border border-gray-300 text-black font-semibold">
          <Image src="/google.svg" alt="google" width={20} height={20} className="mr-2" />
          구글로 로그인
        </button>
      </div>

      {/* 회원가입 안내 */}
      <div className="mt-8 flex items-center justify-center gap-[4px] text-[13px]">
        <span className="text-[#7A7A7A]">아직 회원이 아니신가요?</span>
        <button
          onClick={() => router.push("/signup")}
          className="text-black underline font-semibold text-[13px]"
        >
          지금 회원가입하기
        </button>
      </div>
    </div>
  );
}
