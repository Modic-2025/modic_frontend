import _fetch from "@/APIs/fetcher/ClientSide";
import { getCookie } from "cookies-next";

const GET_REMAIN_GENS_404 = "";
const getRemainGens = async (postId: number): Promise<number | null> => {
  if (postId === 0) return -1;
  const searchParams = new URLSearchParams();
  searchParams.append("postId", postId.toString());
  const response = await (
    await _fetch(
      `${process.env.PUBLIC_NEXT_API_HOST}/api/ai/image-permissions/remaining-generations?${searchParams.toString()}`,
      true
    )
  ).json();

  // if (status === 404) return 0;
  // if (status === 200) return;
  // const { data }= response.data;

  return 0;
};

export default getRemainGens;
