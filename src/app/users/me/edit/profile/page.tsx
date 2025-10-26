"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import InputSet from "@/components/Inputs/InputSet";
import ReadOnlyField from "@/components/ReadOnlyField";
import BottomButton from "@/components/BottomButton";
import useUserMe from "@/hooks/UseUserMe";
import Fail from "@/components/Popups/Fail";
import Success from "@/components/Popups/Success";
import { updatePassword } from "@/APIs/user/update-password";

export default function ProfileEditPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [updateToken, setUpdateToken] = useState<string | null>(null);
  const { data: user, error } = useUserMe(accessToken);

  // 비밀번호 변경 상태
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 팝업 상태
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // 클라이언트 사이드에서 토큰 가져오기 및 접근 제어
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setAccessToken(token);

    // profileEditToken 확인 (비밀번호 인증을 거쳤는지)
    const editToken = sessionStorage.getItem("profileEditToken");
    if (!editToken) {
      // 토큰이 없으면 비밀번호 인증 페이지로 리다이렉트
      router.push("/users/me/edit");
      return;
    }
    setUpdateToken(editToken);
  }, [router]);

  const handleUploadSuccess = (imageUrl: string, imageId: string) => {
    console.log("Image uploaded successfully:", { imageUrl, imageId });
    // 필요시 사용자 프로필 재조회 또는 상태 업데이트
  };

  const handleUploadError = (error: string) => {
    setErrorMessage(error);
    setShowErrorPopup(true);
  };

  const handlePasswordChange = async () => {
    // 입력 검증
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("새 비밀번호를 입력해주세요.");
      setShowErrorPopup(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      setShowErrorPopup(true);
      return;
    }

    // 비밀번호 강도 검증 (최소 6자)
    if (newPassword.length < 6) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      setShowErrorPopup(true);
      return;
    }

    if (!updateToken) {
      setErrorMessage("인증 토큰이 만료되었습니다. 다시 시도해주세요.");
      setShowErrorPopup(true);
      // 인증 페이지로 리다이렉트
      setTimeout(() => {
        router.push("/users/me/edit");
      }, 2000);
      return;
    }

    setIsLoading(true);
    try {
      const success = await updatePassword(newPassword, updateToken);

      if (success) {
        // 토큰 삭제
        sessionStorage.removeItem("profileEditToken");
        setShowSuccessPopup(true);
      } else {
        setErrorMessage("비밀번호 변경에 실패했습니다.");
        setShowErrorPopup(true);
      }
    } catch (error) {
      setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessPopup(false);
    router.push("/users/me");
  };

  // 로딩 중 또는 토큰 확인 중
  if (!accessToken || !updateToken || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {/* 성공 팝업 */}
      {showSuccessPopup && (
        <Success
          title="비밀번호 변경 완료"
          desc="비밀번호가 성공적으로 변경되었습니다."
          buttonText="확인"
          onConfirm={handleSuccessConfirm}
        />
      )}

      {/* 프로필 이미지 */}
      <ProfileImageUploader
        currentImageUrl={user.userImageUrl}
        hasUserImage={user.hasUserImage}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />

      {/* 이름 (읽기 전용) */}
      <div className="mb-4">
        <ReadOnlyField
          title="이름"
          value={user.userName || ""}
          placeholder="이름"
        />
      </div>

      {/* 이메일 (읽기 전용) */}
      <div className="mb-4">
        <ReadOnlyField
          title="이메일"
          value={user.userEmail || ""}
          placeholder="이메일"
        />
      </div>

      {/* 비밀번호 변경 */}
      <div className="mb-4">
        <InputSet
          title="비밀번호"
          inputLayout="BLIND"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새로운 비밀번호를 입력해주세요"
        />
      </div>

      <div className="mb-4">
        <InputSet
          title="비밀번호 확인"
          inputLayout="BLIND"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새로운 비밀번호를 확인해주세요"
        />

        {/* 비밀번호 일치 여부 표시 */}
        {confirmPassword && (
          <p
            className={`text-sm mt-2 ${
              newPassword === confirmPassword
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {newPassword === confirmPassword
              ? "✓ 비밀번호가 일치합니다"
              : "✗ 비밀번호가 일치하지 않습니다"}
          </p>
        )}
      </div>

      {/* 저장 버튼 */}
      <BottomButton onClick={handlePasswordChange} disabled={isLoading}>
        {isLoading ? "변경 중..." : "저장"}
      </BottomButton>
    </div>
  );
}
