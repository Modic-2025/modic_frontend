import "@/components/ArtCard/ArtCard.css";
import { Art_thumbnail, Art } from "@/types/Art";
import Link from "next/link";

const ArtCard = (props: {
  // type: "thumbnail" | "full";
  data: Art | Art_thumbnail;
}) => {
  return (
    <Link href={`/art/${props.data.id}`}>
      <figure className="art bg-gray-200 min-h-40 rounded-lg">
        <img src={props.data.img_urls} title={props.data.id} />
      </figure>
    </Link>
  );
};

export default ArtCard;
