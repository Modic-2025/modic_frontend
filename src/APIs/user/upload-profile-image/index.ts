export type UploadProfileImageResult = {
  imageId: string;
  imageUrl: string;
  imagePath: string;
};

/**
 * 프로필 이미지를 S3에 업로드하고 이미지 정보를 반환합니다.
 * PROFILE 전용 API 흐름: save-url → S3 업로드 → callback → get-url
 *
 * @param file - 업로드할 이미지 파일
 * @returns Promise<UploadProfileImageResult | null> - 성공 시 이미지 정보, 실패 시 null
 */
export const uploadProfileImage = async (
  file: File
): Promise<UploadProfileImageResult | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return null;
    }

    // 1. save-url 요청 - presigned URL 받기
    const saveUrlRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/images/save-url`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUsagePurpose: "PROFILE",
          fileName: file.name,
        }),
      }
    );

    if (!saveUrlRes.ok) {
      console.error("Failed to get save URL:", await saveUrlRes.text());
      return null;
    }

    const saveUrlData = await saveUrlRes.json();
    const { imageSaveUrl, imagePath } = saveUrlData.data;

    // 2. S3에 직접 업로드
    const uploadRes = await fetch(imageSaveUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadRes.ok) {
      console.error("Failed to upload to S3:", uploadRes.status);
      return null;
    }

    // 3. callback 호출 - 업로드 완료 알림
    const callbackRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/images/save-url/callback`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          imagePath: imagePath,
          imageUsagePurpose: "PROFILE",
        }),
      }
    );

    if (!callbackRes.ok) {
      const errorText = await callbackRes.text();
      console.error("Callback failed:", errorText);
      return null;
    }

    const callbackData = await callbackRes.json();
    const { imageId } = callbackData.data;

    // 4. 이미지 URL 가져오기 (옵션)
    try {
      const getUrlRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/images/${imageId}/get-url`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (getUrlRes.ok) {
        const getUrlData = await getUrlRes.json();
        return {
          imageId,
          imageUrl: getUrlData.data.imageGetUrl,
          imagePath,
        };
      }
    } catch (error) {
      console.warn("Failed to get image URL, using imagePath:", error);
    }

    // get-url 실패 시 imagePath 반환
    return {
      imageId,
      imageUrl: imagePath,
      imagePath,
    };
  } catch (error) {
    console.error("Upload profile image error:", error);
    return null;
  }
};
