import { APIFailureMsg } from "@/APIs";
import _fetch from "@/APIs/fetcher/ClientSide";

// On create post
type UpdatePostPayload = {
  id: number;
  title: string;
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  ticketPrice: number;
  imageIds: string[];
  thumbnailImageId: number;
};
const updatePost = async (
  id: number,
  title: string,
  desc: string,
  ticketPrice: number,
  imageIds: number[],
  comPrice?: number,
  nonComPrice?: number
): Promise<APIFailureMsg | boolean> => {
  const payload: UpdatePostPayload = {
    id,
    title: title,
    description: desc,
    commercialPrice: comPrice || 0,
    nonCommercialPrice: nonComPrice || 0,
    imageIds: imageIds.map((item) => String(item)),
    thumbnailImageId: imageIds[0],
    ticketPrice,
  };

  const response = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${id}`,
    true,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const { status } = response;

  // incomplete
  if (status !== 204) {
    const data = await response.json();
    const { code, message, reason } = data;
    if (code == "C-001") {
      const failReason =
        `게시글을 수정할 수 없었습니다. (${message})` +
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

  return true;
};

export default updatePost;
