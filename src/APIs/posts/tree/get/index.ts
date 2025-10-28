import { APIFailureMsg } from "@/APIs";
import _fetch from "@/APIs/fetcher/ServerSide";

const getTreeData: () => Promise<APIFailureMsg> = async (postId: number) => {
  const response = await (
    await _fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${postId}/tree`,
      true
    )
  ).json();

  console.log("response :>> ", response);
  return {
    code: 500,
  };
};

export default getTreeData;
