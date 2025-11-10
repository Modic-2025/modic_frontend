import { Art_thumbnail } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";

const ArtCard = ({
  data,
  onClick,
}: {
  data: Art_thumbnail;
  onClick?: (art: Art_thumbnail) => void; // for display detail popups
}) => {
  const isWrapImage = Boolean(!onClick);

  const { postId, images } = data;
  const safeThumbnailUrl = images?.[0]?.imageUrl;

  // on click card
  const onClickCard = () => {
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
          onMouseEnter={() => preload(safeThumbnailUrl, { as: "image" })}
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
      onMouseEnter={() => preload(safeThumbnailUrl, { as: "image" })}
    />
  );
};

export default ArtCard;
