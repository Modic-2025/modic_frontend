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
import { mutate } from "swr";

export default function ProfileEditPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [updateToken, setUpdateToken] = useState<string | null>(null);
  const { data: user } = useUserMe(accessToken);

  // 프로필 이미지 변경 상태
  const [imageChanged, setImageChanged] = useState(false);
  // const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);

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

  const handleUploadSuccess = () => {
    setImageChanged(true);
    // setUploadedImageId(imageId);
    // SWR 캐시 갱신
    if (accessToken) {
      mutate([
        `${process.env.NEXT_PUBLIC_API_HOST}/api/profiles/me`,
        accessToken,
      ]);
    }
  };

  const handleUploadError = (error: string) => {
    setErrorMessage(error);
    setShowErrorPopup(true);
  };

  const handleSave = async () => {
    const hasPasswordChange =
      newPassword.trim() !== "" || confirmPassword.trim() !== "";
    const hasAnyChange = imageChanged || hasPasswordChange;

    // 변경사항이 없으면 저장하지 않음
    if (!hasAnyChange) {
      setErrorMessage("변경된 내용이 없습니다.");
      setShowErrorPopup(true);
      return;
    }

    // 비밀번호 변경이 있는 경우에만 검증
    if (hasPasswordChange) {
      // 비밀번호 필드가 부분적으로만 입력된 경우
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setErrorMessage("새 비밀번호를 모두 입력해주세요.");
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

        if (!success) {
          setErrorMessage("비밀번호 변경에 실패했습니다.");
          setShowErrorPopup(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("error :>> ", error);
        setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
        setShowErrorPopup(true);
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // 성공 처리 (이미지만 변경되었거나, 비밀번호 변경 성공)
    sessionStorage.removeItem("profileEditToken");
    setShowSuccessPopup(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessPopup(false);
    router.push("/users/me");
  };

  // 성공 메시지 동적 생성
  const getSuccessMessage = () => {
    const hasPasswordChange = newPassword.trim() !== "";

    if (imageChanged && hasPasswordChange) {
      return "프로필 이미지와 비밀번호가 변경되었습니다.";
    } else if (imageChanged) {
      return "프로필 이미지가 변경되었습니다.";
    } else if (hasPasswordChange) {
      return "비밀번호가 변경되었습니다.";
    }
    return "프로필이 수정되었습니다.";
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
          title="프로필 수정 완료"
          desc={getSuccessMessage()}
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
      <BottomButton onClick={handleSave} disabled={isLoading}>
        {isLoading ? "저장 중..." : "저장"}
      </BottomButton>
    </div>
  );
}
