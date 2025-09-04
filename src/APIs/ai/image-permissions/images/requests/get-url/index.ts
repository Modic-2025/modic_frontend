import { APIFailureMsg } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

const getAiUrl = async (requestId: string): Promise<string | APIFailureMsg> => {
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/requests/${requestId}/get-url`,
      true
    )
  ).json();

  const { isSuccess, status, data } = response;

  if (status === 200) {
    const { imageGetUrl } = data;
    return imageGetUrl;
  }

  return {
    code: status,
    title: "이미지를 조회할 수 없었습니다.",
    desc: "잠시 후 다시 시도해주세요",
  };
};

export default getAiUrl;
