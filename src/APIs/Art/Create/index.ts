import { APIFailureMsg } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

// On create post
type CreatePostPayload = {
  title: string;
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  ticketPrice: number;
  imageIds: string[];
  thumbnailImageId: number;
};
const createPost = async (
  title: string,
  desc: string,
  ticketPrice: number,
  imageIds: number[],
  comPrice?: number,
  nonComPrice?: number
): Promise<APIFailureMsg | number> => {
  const payload: CreatePostPayload = {
    title: title,
    description: desc,
    commercialPrice: comPrice || 0,
    nonCommercialPrice: nonComPrice || 0,
    imageIds: imageIds.map((item) => String(item)),
    thumbnailImageId: imageIds[0],
    ticketPrice,
  };

  const response = await (
    await _fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/posts`, true, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(payload),
    })
  ).json();

  const { status, isSuccess, data } = response;

  // incomplete
  if (!isSuccess) {
    const { code, message, reason } = response;
    if (code == "C-001") {
      const failReason =
        `게시글을 만들 수 없었습니다. (${message})` +
        "\n" +
        "- " +
        reason.join("\n- ");
      return {
        code: status,
        title: failReason,
      };
    }

    return {
      code: status,
      title: message,
    };
  }

  const { postId } = data;
  return postId;
};

export default createPost;
