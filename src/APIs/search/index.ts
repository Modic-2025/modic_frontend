import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ServerSide";
import { TypePaging } from "@/types";

/**
 * Post or User를 검색합니다.
 * @param keyword
 * @param page
 * @param size
 * @param postType
 */
export type TypeSearchContent<T> = TypePaging & {
  content: T[];
};
const search = async <T>(
  mode: "POST" | "USER",
  keyword: string,
  page: number,
  size: number,
  postType?: "ALL" | "ORIGINAL" | "AI_DERIVED"
): Promise<APIFailureMsg | TypeSearchContent<T>> => {
  const params = new URLSearchParams();
  params.append("keyword", keyword);
  params.append("page", page.toString());
  params.append("size", size.toString());
  params.append("postType", postType || "ALL");

  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/${mode === "POST" ? "posts" : "users"}/search?${params.toString()}`,
      true
    )
  ).json();

  const { isSuccess } = response;

  if (!isSuccess) {
    const { status } = response;
    switch (status) {
      case 400:
        return {
          code: status,
          title: "잘못된 입력입니다.",
        };
      default:
        return {
          code: 500,
          title: TITLE_500,
        };
    }
  }

  const data: TypeSearchContent<T> = response.data;

  return data;
};

export default search;
