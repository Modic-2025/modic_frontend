import { Art_thumbnail, Art } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";

const ArtCard = (props: {
  // type: "thumbnail" | "full";
  data: Art | Art_thumbnail;
}) => {
  return (
    <Link href={`/art/${props.data.id}`}>
      <figure className="art">
        <Image
          src={props.data.images[0].imageUrl}
          layout="raw"
          width={200}
          height={200}
          className="rounded-xl bg-gray-200"
          alt={props.data.images[0].imageUrl}
          title={props.data.id}
        />
        {/* <img
          src={props.data.images[0].imageUrl}
          className="rounded-xl bg-gray-200"
          alt={props.data.images[0].imageUrl}
          title={props.data.id}
        /> */}
      </figure>
    </Link>
  );
};

export default ArtCard;
