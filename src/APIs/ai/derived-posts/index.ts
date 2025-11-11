import { APIFailureMsg, DESC_500, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

const CREATE_DERIVED_POST_400_AI_014 =
  "해당 이미지는 원작의 그림체가 적용되지 않아 2차 창작물로 등록이 불가합니다.";
const CREATE_DERIVED_POST_403 = "해당 이미지에 대한 권한이 없습니다.";
const CREATE_DERIVED_POST_404 = "해당 이미지를 찾을 수 없습니다.";
export const createDerivedPost = async (
  createdAiImageId: number,
  title: string,
  description: string,
  commercialPrice: number,
  nonCommercialPrice: number,
  ticketPrice: number
): Promise<number | APIFailureMsg> => {
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/derived-posts`,
      true,
      {
        body: JSON.stringify({
          createdAiImageId,
          title,
          description,
          commercialPrice,
          nonCommercialPrice,
          ticketPrice,
        }),
        method: "POST",
      }
    )
  ).json();

  const { status, code, message, isSuccess } = response;

  if (!isSuccess) {
    switch (status) {
      case 400:
        return {
          code: 400,
          title: CREATE_DERIVED_POST_400_AI_014,
          desc: message,
        };
      case 403:
        return {
          code: 403,
          title: CREATE_DERIVED_POST_403,
          desc: message,
        };
      case 404:
        return {
          code: 404,
          title: CREATE_DERIVED_POST_404,
          desc: message,
        };
      case 409:
        return {
          code: 409,
          title: message,
        };
      default:
        return {
          code: 500,
          title: TITLE_500,
          desc: DESC_500,
        };
    }
  }

  // Success
  let { postId } = response.data;
  return postId;
};
