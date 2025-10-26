import UploadImage from "@/APIs/ImageUploader";

export type UploadProfileImageResult = {
  imageId: string;
  imageUrl: string;
  imagePath: string;
};

/**
 * 프로필 이미지를 S3에 업로드하고 이미지 정보를 반환합니다.
 *
 * @param file - 업로드할 이미지 파일
 * @returns Promise<UploadProfileImageResult | null> - 성공 시 이미지 정보, 실패 시 null
 */
export const uploadProfileImage = async (
  file: File
): Promise<UploadProfileImageResult | null> => {
  return new Promise((resolve) => {
    UploadImage(
      file,
      ([imageUrl, imagePath, imageId], error) => {
        if (error || !imageUrl || !imageId) {
          console.error("Failed to upload profile image:", error);
          resolve(null);
          return;
        }

        resolve({
          imageId,
          imageUrl,
          imagePath,
        });
      },
      "PROFILE"
    );
  });
};
