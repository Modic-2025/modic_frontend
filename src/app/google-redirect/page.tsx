"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/axiosInstance";

export default function GoogleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      console.error("구글 로그인 실패: code 없음");
      router.push("/login");
      return;
    }

    const loginWithGoogle = async () => {
      try {
        await api.post("/api/auth/google", { code });

        const response = await api.post("/api/auth/reissue");
        const accessToken = response.data.data.accessToken;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          router.push("/art");
        } else {
          throw new Error("accessToken 없음");
        }
      } catch (error) {
        console.error("구글 로그인 처리 실패:", error);
        router.push("/login");
      }
    };

    loginWithGoogle();
  }, [router]);

  return (
    <div className="text-center mt-40">구글 로그인 처리 중입니다...</div>
  );
}
