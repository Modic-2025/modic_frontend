import useSWR from "swr";

const useGenerateImage = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(
    "https://6435-121-131-111-122.ngrok-free.app",
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const generateImage = async (
  style: string,
  image: string,
  callback: Function
) => {
  const formData = new FormData();
  formData.append("style", style);
  formData.append("content", image);
  try {
    const res = await fetch("https://6435-121-131-111-122.ngrok-free.app", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });

    if (!res.ok) {
      // HTTP 에러 처리
      const error = new Error(`HTTP error! status: ${res.status}`);
      callback(null, error);
      return;
    }

    callback(res);
  } catch (e) {
    callback(null, e as Error);
  }
};

export default useGenerateImage;
