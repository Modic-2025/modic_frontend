"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function KakaoRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get("code");

    if (!authorizationCode) {
      console.error("카카오 인가 코드 없음");
      router.push("/login");
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        const response = await axios.post("http://localhost:8080/api/users/social-login", {
          code: authorizationCode,
          socialType: "KAKAO",
        });

        const { accessToken, refreshToken } = response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        console.log("카카오 로그인 성공:", response.data);
        router.push("/welcome");
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        router.push("/login");
      }
    };

    sendCodeToBackend();
  }, [router]);

  return <div className="text-center mt-40">카카오 로그인 처리 중입니다...</div>;
}
