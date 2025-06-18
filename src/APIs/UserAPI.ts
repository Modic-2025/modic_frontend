export const getUserMe = async (token: string) => {
  const res = await fetch(`${process.env.API_HOST}/api/users/me`, {
    // cache: "no-store", // SSR에서 fresh 데이터 원할 때
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    // 에러 처리
    throw new Error("Failed to fetch user info");
  }
  const custom_response = await res.json();
  if (!custom_response.isSuccess) {
    throw new Error("Failed to load user info");
  }
  const user = custom_response.data;
  return user;
};
