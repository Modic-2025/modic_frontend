import { Art_thumbnail, Art, Art_thumbnail_profiles } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";

const ArtCard = ({
  data,
}: {
  // type: "thumbnail" | "full";
  data: Art | Art_thumbnail | Art_thumbnail_profiles;
}) => {
  const { postId, images, imageUrl } = data;
  const safeThumbnailUrl =
    images && images.length > 0 ? images[0].imageUrl : imageUrl;
  return (
    <Link href={`/art/${postId}`}>
      <figure>
        <Image
          src={safeThumbnailUrl}
          alt={safeThumbnailUrl}
          // layout="fill"
          width={200}
          height={200}
          className="rounded-xl bg-gray-200 w-full"
          title={String(postId)}
        />
      </figure>
    </Link>
  );
};

export default ArtCard;
