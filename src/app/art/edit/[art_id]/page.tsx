import { APIFailureMsg } from "@/APIs";
import GetArt from "@/APIs/Art/GetArt";
import ArtRegistrationForm from "@/components/ArtRegistrationForm";
import { Art } from "@/types/Art";

const page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;
  const response: Art | APIFailureMsg = await GetArt(art_id);

  if ("code" in response) {
    return (
      <>
        <p> {response.title}</p>
        <p>{response.desc}</p>
        <span>{response.code}</span>
      </>
    );
  }

  return <ArtRegistrationForm art={response} confirmText="변경사항 저장" />;
};

export default page;
