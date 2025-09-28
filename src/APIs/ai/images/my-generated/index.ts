import { APIFailureMsg } from "@/APIs";
import { default as clientFetch } from "@/APIs/fetcher/ClientSide";
import { default as serverFetch } from "@/APIs/fetcher/ServerSide";

const GET_GEN_IMAGES_400 = "생성된 이미지를 가져올 수 없었습니다.";
type GEN_IMAGE_TYPE = {
  imageId: number;
  imageUrl: string;
  postId: number;
};
export type RESPONSE_BODY_TYPE = {
  content: GEN_IMAGE_TYPE[];
  hasNext: boolean;
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
  isFirst: boolean;
  isLast: boolean;
};
const GetGeneratedImages = async (
  page: number,
  size: number
): Promise<RESPONSE_BODY_TYPE | APIFailureMsg> => {
  const parameters = new URLSearchParams();
  parameters.append("page", page.toString());
  parameters.append("size", size.toString());

  const response = await getFetcher()(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/my-generated?${parameters.toString()}`,
    true
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch generated images ${response.status}`);
  }

  const body = await response.json();
  const { status, data } = body;
  if (status === 400) {
    return {
      code: status,
      title: GET_GEN_IMAGES_400,
    };
  }

  return data;
};

const getFetcher: () => (
  url: string,
  useAuth: boolean,
  options?: RequestInit
) => Promise<Response> = () => {
  return typeof window !== "undefined" ? clientFetch : serverFetch;
};

export default GetGeneratedImages;
