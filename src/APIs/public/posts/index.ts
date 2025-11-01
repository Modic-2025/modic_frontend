import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ServerSide";
import { Art } from "@/types/Art";

type ApiResponse<T> = {
  isSuccess: boolean;
  status: number;
  data?: Art;
  message?: string;
};

const publicGetPost = async (
  postId: string | number
): Promise<Art | APIFailureMsg> => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/public/posts/${postId}`;

  try {
    // 3. API 호출 (public이므로 auth 플래그는 false로 전달)
    const response = await _fetch(url, false);

    // 4. JSON 파싱
    // 만약 _fetch가 5xx 에러 시 HTML을 반환하면 .json()에서 에러가 발생하여
    // 아래 catch 블록으로 이동합니다.
    const responseData: ApiResponse<Art> = await response.json();

    const { status, data, message } = responseData;

    // 5. [에러 제어 플로우] JSON 내부에 포함된 status 코드로 분기
    switch (status) {
      case 200:
        // 성공
        if (data) {
          return data;
        }
        // status는 200이지만 data가 없는 비정상 케이스 처리
        return {
          code: 200,
          title: "데이터 없음",
          desc: "서버가 200 응답을 보냈으나 데이터가 누락되었습니다.",
        };

      case 404:
        // 404: Not Found
        return {
          code: status,
          title: message || "찾을 수 없음",
          desc: message || "포스트를 찾을 수 없습니다.",
        };

      case 401:
      case 403:
        // 401/403: Unauthorized / Forbidden
        return {
          code: status,
          title: "권한 없음",
          desc: message || "이 포스트에 접근할 권한이 없습니다.",
        };

      case 500:
      default:
        // 5xx 서버 에러 또는 그 외 4xx 클라이언트 에러
        const title = status >= 500 ? TITLE_500 : "알 수 없는 에러";
        return {
          code: status,
          title: title || "오류 발생",
          desc: message || "알 수 없는 오류가 발생했습니다.",
        };
    }
  } catch (err) {
    // 6. [에러 제어 플로우] 네트워크 오류 또는 JSON 파싱 실패
    // (e.g., 502 Bad Gateway가 HTML을 반환하는 경우)
    console.error(`[publicGetPost] API Fetch Error: ${err}`);
    return {
      code: -1,
      title: "네트워크 오류",
      desc: (err as Error).message || `API 요청에 실패했습니다: ${url}`,
    };
  }
};

export default publicGetPost;
