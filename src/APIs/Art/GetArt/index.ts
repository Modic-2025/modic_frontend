import _fetch from "@/APIs/fetcher/ServerSide";

const GetArt = async (artId: number) => {
  const art = await _fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/posts/${artId}`,
    true
  );

  return await art.json();
};

export default GetArt;
