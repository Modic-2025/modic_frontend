import { Art_thumbnail, GeneratedImageType } from "@/types/Art";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  // // console.log("isImageLoaded :>> ", isImageLoaded);
  // useEffect(() => {
  //   console.log("isImageLoaded :>> ", isImageLoaded);
  // }, [isImageLoaded]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsImageLoaded(true);
  //   }, 100);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleImageLoadComplete = () => {
    setIsImageLoaded(true);
  };

  const safeAlt =
    "imageUrl" in data ? `Image ${data.imageId}` : `Image ${postId}`;

  const commonImageProps = {
    src: safeThumbnailUrl,
    alt: safeAlt,
    width: 200,
    height: 200,
    className: `w-full h-full object-cover transition-opacity duration-300`,
    // className: `w-full h-full object-cover transition-opacity duration-300 ${
    //   isImageLoaded ? "opacity-100" : "opacity-0"
    // }`,
    title: String(postId),
    // onMouseEnter: () => preload && preload(safeThumbnailUrl, { as: "image" }),
    onLoadingComplete: handleImageLoadComplete,
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
      {/* {!isImageLoaded && (
        <div className="absolute inset-0 bg-gray-2 motion-preset-blink motion-duration-2000 z-0 w-full h-full"></div>
      )} */}

      {!isImageLoaded && (
        <div
          className={`absolute inset-0 bg-gray-200 z-10 pointer-events-none transition-opacity duration-500
        ${isImageLoaded ? "opacity-0" : "opacity-100 motion-preset-blink"}
      `}
        ></div>
      )}

      <div className="relative w-full h-full">
        {isWrapImage ? (
          <Link href={`/art/${postId}`} className="block w-full h-full">
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
