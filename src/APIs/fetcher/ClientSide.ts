const _fetch = async (url: string, useAuth: boolean, options?: RequestInit) => {
  const accessToken = localStorage.getItem("accessToken");
  return await fetch(url, {
    ...options,
    headers: {
      ...(useAuth && {
        Authorization: `Bearer ${accessToken}`,
      }),
      "Content-Type": "application/json",
    },
  });
};

export default _fetch;
