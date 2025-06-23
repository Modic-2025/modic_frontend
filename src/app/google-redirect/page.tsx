"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export default function GoogleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get("code");

    if (!authorizationCode) {
      console.error("인증 코드 없음");
      router.push("/login");
      return;
    }

    const tokenEndpoint = "https://oauth2.googleapis.com/token";

    const data = {
      code: authorizationCode,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_ID || "",
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || "",
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "",
      grant_type: "authorization_code",
    };

    const formBody = new URLSearchParams(data).toString();

    const fetchTokens = async () => {
      try {
        const res = await axios.post(tokenEndpoint, formBody, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const idToken = res.data.id_token;

        const decoded: GoogleUserInfo = jwtDecode(idToken);
        console.log("구글 사용자 정보:", decoded);

        // 백엔드에 소셜 로그인 요청 보내기
        const loginResponse = await axios.post("http://localhost:8080/api/users/social-login", {
          email: decoded.email,
          name: decoded.name,
          socialType: "GOOGLE",
        });

        console.log("로그인 성공:", loginResponse.data);

        router.push("/welcome");
      } catch (error) {
        console.error("로그인 처리 중 오류 발생:", error);
        router.push("/login");
      }
    };

    fetchTokens();
  }, [router]);

  return <div className="text-center mt-40">구글 로그인 처리 중입니다...</div>;
}
