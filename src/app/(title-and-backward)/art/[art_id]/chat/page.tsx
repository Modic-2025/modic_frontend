import Chat from "@/components/Chat";
import { Art } from "@/types/Art";

const Page = async ({ params }: { params: { art_id: number } }) => {
  const { art_id } = await params;
  // console.log("art_id :>> ", art_id);
  // const requestStr = "http://13.124.44.90:8080/api/posts/" + art_id;
  // console.log("requestStr :>> ", requestStr);
  // // 서버에서 art 정보를 가져오는 로직
  // const response = await fetch(requestStr);
  // if (!response.ok) {
  //   return {
  //     notFound: true, // artId에 해당하는 데이터가 없으면 404 페이지를 반환
  //   };
  // }
  // const data = await response.json();
  // const art = data.data;

  return <Chat artId={art_id} />;
};

export default Page;
