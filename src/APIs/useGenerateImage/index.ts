import useSWR from "swr";
import _fetch from "../fetcher/ClientSide";

export const generateImage = async (
  name: string,
  path: string,
  postId: number,
  useTicket: boolean
) => {
  const res = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/ai/images/requests`,
    true,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: name,
        imagePath: path,
        imageUsagePurpose: "AI_REQUEST",
        postId: postId,
        useTicket: useTicket,
      }),
    }
  );

  return res;
};

export default generateImage;
