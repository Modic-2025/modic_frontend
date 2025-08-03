import { Art } from "@/types/Art";
import _fetch from "../fetcher/ClientSide";

const MAX_TITLE_NUM = 20;
const MAX_DESCRIPTION_LENGTH = 800;
const TEXT_IMAGE_RESTRICTION = `최소 1개 이상의 그림을 등록해주세요.`;
const TEXT_TITLE_RESTRICTION = `제목을 입력해주세요.`;
const TEXT_COST_FREE = `해당 그림체를 무료로 게시하시겠습니까?`;
const TEXT_DESC_RESTRICTION = `설명을 1자이상 입력해주세요.`;

// On create post
type CreatePostPayload = {
  title: string;
  description: string;
  commercialPrice: number;
  nonCommercialPrice: number;
  imageIds: string[];
};

export const commonLogicForCreateUpdate = async ({
  imageUrls,
  title,
  description,
  commercialPrice,
  nonCommercialPrice,
}) => {
  if (imageUrls.length < 1) {
    alert(TEXT_IMAGE_RESTRICTION);
    return;
  }
  if (!title) {
    alert(TEXT_TITLE_RESTRICTION);
    return;
  }
  if (description.length < 1) {
    alert(TEXT_DESC_RESTRICTION);
    return;
  }
  if (!commercialPrice && !nonCommercialPrice)
    if (!confirm(TEXT_COST_FREE)) return;

  const payload: CreatePostPayload = {
    title: title,
    description: description,
    commercialPrice: commercialPrice || 0,
    nonCommercialPrice: nonCommercialPrice || 0,
    imageIds: imageUrls.map((item) => item.imageId),
  };

  const requestUrl = art
    ? `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${art.id}`
    : `${process.env.NEXT_PUBLIC_API_HOST}/api/posts`;
  const res = await _fetch(requestUrl, true, {
    method: art ? "PUT" : "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  const { status, isSuccess } = data;

  if (!isSuccess) {
    const { code, message, reason } = data;
    if (code == "C-001") {
      const prefix = art ? "수정할" : "만들";
      const alertMsg =
        `게시글을 ${prefix} 수  없었습니다. (${message})` +
        "\n" +
        "- " +
        reason.join("\n- ");
      alert(alertMsg);
    }
    return;
  }
};
