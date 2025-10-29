"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadProfileImage } from "@/APIs/user/upload-profile-image";

type ProfileImageUploaderProps = {
  currentImageUrl?: string;
  hasUserImage?: boolean;
  onUploadSuccess?: (imageUrl: string, imageId: string) => void;
  onUploadError?: (error: string) => void;
};

const ProfileImageUploader = ({
  currentImageUrl,
  hasUserImage,
  onUploadSuccess,
  onUploadError,
}: ProfileImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    hasUserImage && currentImageUrl ? currentImageUrl : null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      onUploadError?.("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      onUploadError?.("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 로컬 미리보기 즉시 표시
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 서버에 업로드
    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file);

      if (result) {
        setImagePreview(result.imageUrl);
        onUploadSuccess?.(result.imageUrl, result.imageId);
      } else {
        // 업로드 실패 시 이전 이미지로 복구
        setImagePreview(
          hasUserImage && currentImageUrl ? currentImageUrl : null
        );
        onUploadError?.("이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setImagePreview(hasUserImage && currentImageUrl ? currentImageUrl : null);
      onUploadError?.("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-32 h-32">
        {/* 프로필 이미지 */}
        <div
          className={`w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${
            !isUploading ? "cursor-pointer" : "cursor-wait"
          }`}
          onClick={handleImageClick}
        >
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src="/temporary/anonymous.svg"
              alt="Default Profile"
              width={128}
              height={128}
            />
          )}

          {/* 로딩 오버레이 */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* 카메라 아이콘 */}
        <div
          className={`absolute bottom-0 right-0 w-10 h-10 bg-black rounded-full flex items-center justify-center ${
            !isUploading ? "cursor-pointer" : "cursor-wait"
          }`}
          onClick={handleImageClick}
        >
          <Image
            src="/camera.svg"
            alt="Upload"
            width={20}
            height={20}
            className="invert"
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ProfileImageUploader;
