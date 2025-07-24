import GetArt from "@/APIs/Art/GetArt";
import ArtRegistrationForm from "@/components/ArtRegistrationForm";

const page = async ({ params }: { params: Promise<{ art_id: number }> }) => {
  const { art_id } = await params;
  const response = await GetArt(art_id);
  const art = response.data;
  return <ArtRegistrationForm art={art} confirmText="변경사항 저장" />;
};

export default page;
