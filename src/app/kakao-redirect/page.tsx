"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/axiosInstance";

export default function KakaoRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await api.post("/api/auth/reissue");
        const accessToken = response.data.data.accessToken;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          router.push("/art");
        } else {
          throw new Error("토큰 없음");
        }
      } catch (err) {
        console.error("카카오 로그인 처리 실패:", err);
        router.push("/login");
      }
    })();
  }, [router]);

  return (
    <div className="text-center mt-40">카카오 로그인 처리 중입니다...</div>
  );
}
