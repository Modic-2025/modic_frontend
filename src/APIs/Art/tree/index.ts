import { APIFailureMsg, TITLE_500 } from "@/APIs";
import _fetch from "@/APIs/fetcher/ServerSide";
import { PostStatus } from "@/types/Art";

export type TypeTreeItem = {
  postId: number;
  title: string;
  parentPostId: number | null;
  representativeImageUrl: string;
  postStatus: PostStatus;
};

const getPostDerivedTree: (
  postId: number
) => Promise<TypeTreeItem[] | APIFailureMsg> = async (postId: number) => {
  const queryParameter = new URLSearchParams();
  queryParameter.append("postId", postId.toString());
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${postId}/tree?${queryParameter.toString()}`,
      true
    )
  ).json();
  console.log("response :>> ", response);

  const { isSuccess, status } = response;
  if (!isSuccess) {
    switch (status) {
      case 404:
        return {
          code: status,
          title: "해당 게시글을 찾을 수 없습니다.[P-001]",
        };
      default:
        return {
          code: 500,
          title: TITLE_500,
        };
    }
  }

  const { data }: { data: TypeTreeItem[] } = response;

  return data;
};

export default getPostDerivedTree;
