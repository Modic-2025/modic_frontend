import ArtRegistrationForm from "@/components/ArtRegistrationForm";
import { Art, ImageType } from "@/types/Art";

const Page = async ({
  params,
  searchParams,
}: {
  params: { image_id: number };
  searchParams: { imageUrl: string };
}) => {
  const { image_id } = await params;
  const { imageUrl } = await searchParams;
  const safeImageUrl = decodeURIComponent(imageUrl);

  const derivedImage: ImageType = {
    imageId: Number(image_id),
    imageUrl: safeImageUrl,
  };

  const art: Art = {
    images: [derivedImage],
  };

  return (
    <>
      <ArtRegistrationForm art={art} isDerived={true} />
    </>
  );
};

export default Page;
