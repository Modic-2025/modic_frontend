/**
 * 비밀번호 변경을 위한 update-token을 발급받습니다.
 *
 * @param password - 현재 비밀번호
 * @returns Promise<string | null> - 성공 시 updateToken, 실패 시 null
 */
export const getUpdateToken = async (
  password: string
): Promise<string | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/update-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to get update token:", errorData);
      return null;
    }

    const data = await response.json();

    // API 응답: {status: 200, data: {userUpdateToken: "..."}, isSuccess: true}
    if (data.isSuccess && data.data?.userUpdateToken) {
      return data.data.userUpdateToken;
    }

    return null;
  } catch (error) {
    console.error("Error getting update token:", error);
    return null;
  }
};
