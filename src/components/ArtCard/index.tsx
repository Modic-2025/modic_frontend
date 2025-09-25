import { Art_thumbnail, Art, Art_thumbnail_profiles } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";

const ArtCard = ({
  data,
  onClick,
}: {
  data: Art | Art_thumbnail | Art_thumbnail_profiles;
  onClick?: (art: Art | Art_thumbnail | Art_thumbnail_profiles) => void; // for display detail popups
}) => {
  const isWrapImage = Boolean(!onClick);

  const { postId, images, imageUrl } = data;
  const safeThumbnailUrl =
    images && images.length > 0 ? images[0].imageUrl : imageUrl;

  // on click card
  const onClickCard = (e) => {
    onClick && onClick(data);
  };

  return isWrapImage ? (
    <Link href={`/art/${postId}`}>
      <figure>
        <Image
          src={safeThumbnailUrl}
          alt={safeThumbnailUrl}
          width={200}
          height={200}
          className="rounded-xl bg-gray-200 w-full"
          title={String(postId)}
        />
      </figure>
    </Link>
  ) : (
    <Image
      src={safeThumbnailUrl}
      alt={safeThumbnailUrl}
      onClick={onClickCard}
      width={200}
      height={200}
      className="rounded-xl bg-gray-200 w-full cursor-pointer"
      title={String(postId)}
    />
  );
};

export default ArtCard;
