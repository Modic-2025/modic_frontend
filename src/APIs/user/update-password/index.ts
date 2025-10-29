/**
 * 비밀번호를 변경합니다.
 *
 * @param newPassword - 새로운 비밀번호
 * @param updateToken - getUpdateToken으로 발급받은 토큰
 * @returns Promise<boolean> - 성공 시 true, 실패 시 false
 */
export const updatePassword = async (
  newPassword: string,
  updateToken: string
): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return false;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          newPassword,
          updateToken,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to update password:", errorData);
      return false;
    }

    // 204 No Content 또는 빈 응답 처리
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // JSON 응답이 아니면 상태 코드만으로 성공 판단
      return response.status >= 200 && response.status < 300;
    }

    // JSON 응답이 있는 경우 파싱
    const data = await response.json();
    return data.isSuccess === true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};
