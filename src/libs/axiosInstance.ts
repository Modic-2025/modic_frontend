import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const res = await api.post("/api/auth/reissue");
      const newAccessToken = res.data.data?.accessToken;

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(config);
      } else {
        throw new Error("토큰 재발급 실패");
      }
    } catch (reissueError) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(reissueError);
    }
  }
);

export default api;
