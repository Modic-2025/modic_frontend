import { Art_thumbnail, GeneratedImageType } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { preload } from "react-dom";

const ArtCard = ({
  data,
  onClick,
}: {
  data: Art_thumbnail | GeneratedImageType;
  onClick?: (art: Art_thumbnail | GeneratedImageType) => void; // for display detail popups
}) => {
  const isWrapImage = Boolean(!onClick);

  const { postId } = data;
  const safeImages =
    "imageUrl" in data
      ? [{ imageId: data.imageId, imageUrl: data.imageUrl }]
      : data.images; // GeneratedImageType

  const safeThumbnailUrl = safeImages?.[0]?.imageUrl;

  // on click card
  const onClickCard = () => {
    onClick && onClick(data);
  };

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoadComplete = () => {
    setIsImageLoaded(true);
  };

  const commonImageProps = {
    src: safeThumbnailUrl,
    alt: safeThumbnailUrl,
    width: 200,
    height: 200,
    // 여기서는 부모의 overflow-hidden에 맡기기 위해 rounded-xl을 제거했습니다.
    className: `w-full h-full object-cover transition-opacity duration-300 ${
      isImageLoaded ? "opacity-100" : "opacity-0"
    }`,
    title: String(postId),
    onMouseEnter: () => preload && preload(safeThumbnailUrl, { as: "image" }),
    onLoadingComplete: handleImageLoadComplete,
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
      {/* {!isImageLoaded && (
        <div className="absolute inset-0 bg-gray-2 motion-preset-blink motion-duration-2000 z-0 w-full h-full"></div>
      )} */}

      <div
        className={`absolute inset-0 bg-gray-2 motion-preset-blink motion-duration-1500 w-full h-full transition-opacity duration-300 ${isImageLoaded ? "opacity-0" : "opacity-100"}`}
      ></div>

      <div className="relative  w-full h-full">
        {isWrapImage ? (
          <Link href={`/art/${postId}`} className="block w-full h-full">
            {/* figure 태그는 불필요한 마진을 가질 수 있어 제거하고 직접 스타일링하는 게 좋습니다. */}
            <Image
              {...commonImageProps}
              className={`${commonImageProps.className} cursor-pointer`}
            />
          </Link>
        ) : (
          <Image
            {...commonImageProps}
            onClick={onClickCard}
            className={`${commonImageProps.className} cursor-pointer`}
          />
        )}
      </div>
    </div>
  );
};

export default ArtCard;
