"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputSet from "@/components/Inputs/InputSet";
import BottomButton from "@/components/BottomButton";
import Fail from "@/components/Popups/Fail";
import { getUpdateToken } from "@/APIs/user/get-update-token";

/**
 * 프로필 편집 권한 인증 페이지
 * 비밀번호를 입력받아 update-token을 발급받고,
 * 발급받은 토큰을 가지고 실제 프로필 편집 페이지로 이동합니다.
 */
export default function ProfileEditAuthPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = await getUpdateToken(password);

      if (token) {
        // 토큰을 sessionStorage에 저장 (페이지 새로고침 시 유지, 탭 닫으면 삭제)
        sessionStorage.setItem("profileEditToken", token);

        // 프로필 편집 페이지로 이동
        router.push("/users/me/edit/profile");
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.log("error :>> ", error);
      setErrorMessage("비밀번호 확인 중 오류가 발생했습니다.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      {/* 에러 팝업 */}
      {showErrorPopup && (
        <Fail
          title="오류"
          desc={errorMessage}
          onCancel={() => setShowErrorPopup(false)}
        />
      )}

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-6">
          프로필을 편집하려면 비밀번호를 입력해주세요.
        </p>

        <InputSet
          title="비밀번호"
          inputLayout="BLIND"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      <BottomButton onClick={handleVerifyPassword} disabled={isLoading}>
        {isLoading ? "확인 중..." : "저장"}
      </BottomButton>
    </div>
  );
}
