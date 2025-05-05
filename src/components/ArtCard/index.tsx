import "@/components/ArtCard/ArtCard.css";
import { Art_thumbnail, Art } from "@/types/Art";
import Link from "next/link";

const ArtCard = (props: {
  // type: "thumbnail" | "full";
  data: Art | Art_thumbnail;
}) => {
  return (
    <Link href={`/art/${props.data.id}`}>
      <figure className="art">
        <img
          src={props.data.imageUrls[0]}
          className="rounded-xl bg-gray-200"
          alt={props.data.imageUrls[0]}
          title={props.data.id}
        />
      </figure>
    </Link>
  );
};

export default ArtCard;
