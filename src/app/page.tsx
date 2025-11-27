"use client";
import React, { Suspense, useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/libs/axiosInstance";
import { setCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";

const LandingPageContent = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. 에러 메시지 관리를 위한 State 추가
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사: 둘 중 하나라도 비어있으면 에러 처리
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 통과 시 로직 (API 호출 등)
    setError(""); // 에러 초기화

    if (isLoginMode) {
      handleLogin();
      return;
    }
    handleRegist();
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", { email, password });
      const { accessToken } = res.data.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // FOR DEVELOP
        setCookie("accessToken", accessToken); // FOR DEVELOP
      }

      // 4. 쿼리 파라미터에서 'redirectUrl'을 가져옵니다.
      const redirectUrl = searchParams.get("redirectUrl");

      // 5. redirectUrl이 있으면 해당 URL로, 없으면 '/art'로 이동합니다.
      if (redirectUrl) {
        // 이전 페이지의 문맥 초기화를 위해 broswer method를 사용합니다
        // ex) SWR를 사용하는 페이지에서 error 객체가 유지되는 문제
        window.location.replace(redirectUrl);
      } else {
        router.push("/art");
      }
    } catch (err) {
      console.error(err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegist = () => {
    router.push("/signup");
  };

  // 탭 변경 시 에러 및 입력값 초기화 (선택사항)
  const toggleMode = (mode: boolean) => {
    setIsLoginMode(mode);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    // h-[100dvh]: 모바일 브라우저 상단/하단 바에 가려지지 않게 동적 높이 사용
    <div className="fixed top-0 left-0 w-full z-10 bg-[#FF8820] flex items-center justify-center overflow-hidden font-sans h-svh">
      {/* 배경 장식 (반응형 크기 조절) */}
      {/* <div className="absolute top-[-10%] right-[-10%] w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 md:w-80 md:h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" /> */}

      {/* 메인 컨테이너 
          - max-w-[430px]: 데스크탑에서도 모바일 앱 비율 유지
          - flex-col: 수직 배치
      */}
      <div className="w-full max-w-[430px] h-full flex flex-col relative z-10   overflow-hidden bg-[#FF8820]">
        {/* 1. 히어로 섹션 (로고 & 폰 목업)
            - flex-1: 남는 공간을 모두 차지
            - min-h-0: flex container 안에서 내용물이 넘칠 때 줄어들 수 있게 함 (중요)
            - overflow-hidden: 화면이 작아지면 폰 이미지가 잘리더라도 레이아웃을 깨지 않음
        */}
        <div className="flex-1 flex flex-col items-center justify-between min-h-0 overflow-hidden relative">
          {/* 타이포그래피 (화면 높이가 아주 작으면 숨김) */}
          <div className="text-left w-full px-4 mb-4 md:mb-8 shrink-0 z-20 transition-all duration-300">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter transition-all">
              MODIC
            </h1>
            <div className="w-full h-0.5 bg-white/50 my-2 md:my-3 origin-left" />
            <p className="text-white/90 text-md md:text-lg font-medium tracking-wide">
              AI 시대의 저작권 시스템
            </p>
          </div>

          {/* 폰 목업 비주얼 
              - 높이가 600px 이하일 때는 폰 이미지를 숨겨서 로그인 폼 공간 확보 (hidden short:hidden)
          */}
          <div className="relative w-full flex justify-center items-start perspective-1000 shrink transition-transform duration-500 scale-90 md:scale-100 short:scale-75 short:opacity-50 h-[300px] md:h-[400px] motion-preset-pop">
            <Link href="/art" className="-ml-38 mt-12 md:-mt-8 md:-ml-48">
              {/* 뒤쪽 폰 (채팅) - 모바일에서 사이즈 축소 */}
              <div className="absolute w-[140px] h-[280px] md:w-[200px] md:h-[380px] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-4 border-gray-100 transform rotate-12 translate-x-8 translate-y-4 md:translate-x-10 opacity-90 transition-all duration-700 hover:rotate-6 hover:translate-x-4 hover:scale-105 overflow-hidden">
                <div className="bg-gray-100 h-full p-3 flex flex-col gap-2 ">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 shrink-0" />
                    <div className="bg-white p-2 rounded-2xl rounded-tl-none text-[10px] md:text-xs text-gray-500 shadow-sm leading-tight">
                      이 그림체로..
                    </div>
                  </div>
                  <div className="w-full h-24 md:h-32 bg-gray-200 rounded-xl overflow-hidden relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <ImageIcon size={24} />
                    </div>
                  </div>
                </div>
              </div>
              {/* </Link>
            <Link href="/art"> */}
              {/* 앞쪽 폰 (메인) - 모바일에서 사이즈 축소 */}
              <div className="absolute w-[140px] h-[280px] md:w-[200px] md:h-[380px] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-gray-100 transform -rotate-6 -translate-x-4 z-10 overflow-hidden transition-all duration-700 hover:-rotate-3 hover:-translate-x-2 hover:scale-105">
                <div className="h-2/3 bg-gray-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <Image
                    src="/landing-page/monalisa.jpg"
                    alt="monalisa"
                    fill
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full inline-block mb-1">
                      투표 진행중
                    </p>
                  </div>
                </div>
                <div className="h-1/3 bg-white p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full" />
                    <div className="w-5 h-5 rounded-full bg-gray-100" />
                  </div>
                  <div className="w-full h-8 md:h-10 bg-black text-white rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold">
                    그림 생성하기
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 2. 로그인/회원가입 섹션
            - rounded-t-[2.5rem]: 위쪽 둥근 모서리 강화
            - flex-shrink-0: 화면 높이가 줄어들어도 이 섹션의 크기는 줄어들지 않음 (최우선 순위)
            - z-30: 폰 이미지 위로 올라오도록 설정
        */}
        <div className="bg-white w-full rounded-t-[2rem] md:rounded-t-[2.5rem] p-6 pb-8 z-30 flex-shrink-0 motion-preset-slide-up">
          {/* 탭 버튼 */}
          <div className="flex gap-6 mb-6 px-2">
            <button
              onClick={() => toggleMode(true)}
              className={`text-lg md:text-xl font-bold pb-1 transition-colors ${isLoginMode ? "text-[#FF8820] border-b-2 border-[#FF8820]" : "text-gray-300"}`}
            >
              로그인
            </button>
            <button
              onClick={() => router.push("/signup")}
              // onClick={() => toggleMode(false)}
              className={`text-lg md:text-xl font-bold pb-1 transition-colors ${!isLoginMode ? "text-[#FF8820] border-b-2 border-[#FF8820]" : "text-gray-300"}`}
            >
              회원가입
            </button>
          </div>

          {/* 폼 입력 영역 */}
          <form
            className="flex flex-col gap-3 md:gap-4"
            onSubmit={handleSubmit}
          >
            <div className="relative group">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${error && !email ? "text-red-500" : "text-gray-300 group-focus-within:text-[#FF8820]"}`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(""); // 타이핑 시작하면 에러 제거
                }}
                placeholder="이메일 주소"
                // 에러 발생 시 테두리 색상 변경 로직 추가
                className={`w-full bg-gray-50 border rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none transition-all text-sm font-medium
                  ${
                    error && !email
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-100 focus:ring-2 focus:ring-[#FF8820]/20 focus:border-[#FF8820]"
                  }`}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative group">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${error && !password ? "text-red-500" : "text-gray-300 group-focus-within:text-[#FF8820]"}`}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="비밀번호"
                className={`w-full bg-gray-50 border rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none transition-all text-sm font-medium
                  ${
                    error && !password
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-100 focus:ring-2 focus:ring-[#FF8820]/20 focus:border-[#FF8820]"
                  }`}
              />
            </div>

            {/* 에러 메시지 표시 영역 */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs px-2 animate-shake">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              onClick={() =>
                handleSubmit(new Event("submit") as unknown as React.FormEvent)
              }
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-bold text-md md:text-base hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-gray-200 disabled:bg-gray-400"
            >
              {!loading ? "시작하기" : "로그인 중 .."}
              {!loading && <ArrowRight size={18} />}
            </button>
            <Link
              href="/art"
              className="underline text-(--color-gray-4) text-center text-xs"
            >
              간단히 둘러보기
            </Link>
          </form>

          {/* 소셜 로그인 */}
          {/* <div className="mt-4 md:mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative bg-white px-4 text-xs font-medium text-gray-400">
                SNS 계정으로 계속하기
              </span>
            </div>

            <div className="flex justify-center gap-5">
              <button className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">
                <MessageCircle
                  size={22}
                  className="text-[#391B1B] fill-[#391B1B]"
                />
              </button>
              <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">
                <Apple size={22} className="text-white fill-white" />
              </button>
              <button className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
            </div>
          </div> */}

          <div className="text-center text-gray-400 text-[10px] mt-4">
            Contact: hellomodic@gmail.com
          </div>
          <div className="text-center text-gray-300 text-[10px] mt-4">
            © 2026 Team MODIC. All rights reserved
          </div>
        </div>
      </div>

      {/* Tailwind Custom Config에 'short' 스크린이 없으므로 인라인 스타일 예시:
        실제 tailwind.config.js에 extend: { screens: { 'short': { 'raw': '(max-height: 600px)' } } } 
        를 추가하면 높이 기반 반응형 제어가 가능합니다. 
      */}
      <style jsx>{`
        @media (max-height: 700px) {
          .shrink-on-short {
            transform: scale(0.8);
          }
        }
        @media (max-height: 600px) {
          .hide-on-very-short {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

const LandingPage = () => (
  <Suspense fallback={<div>로딩중...(in Suspense)</div>}>
    <LandingPageContent />
  </Suspense>
);

export default LandingPage;
