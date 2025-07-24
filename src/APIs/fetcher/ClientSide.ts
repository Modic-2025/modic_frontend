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
  }).then(async (res) => {
    return res;
  });
};

export default _fetch;
