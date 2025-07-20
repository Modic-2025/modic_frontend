"use client";
import UploadImage from "@/APIs/ImageUploader";
import "swiper/css";
import { ImageType } from "@/types/Art";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import useIsMounted from "@/hooks/UseIsMounted";

// Dynamic imports for hydration issues with Swiper
const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});
Swiper.displayName = "Swiper";
const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false }
);
SwiperSlide.displayName = "SwiperSlide";

const DEFAULT_MAX_IMAGES = 10;

const FAKE_IMAGES_DATA: ImageType[] = [
  {
    imageUrl:
      "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
    imageId: "1",
  },
  {
    imageUrl:
      "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
    imageId: "2",
  },
  {
    imageUrl:
      "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
    imageId: "3",
  },
  {
    imageUrl:
      "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
    imageId: "4",
  },
];

type props = enableEditType & {
  items?: ImageType[]; // for init
  max?: number;
};

const ImageList = ({ items, enableEdit, max = DEFAULT_MAX_IMAGES }: props) => {
  // Component lifecycle state
  const isMounted = useIsMounted();

  // const [images, setImages] = useState<ImageType[]>(items || []);
  const [images, setImages] = useState<ImageType[]>(items || FAKE_IMAGES_DATA);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Event listener
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      if (images.length + newFiles.length > max) {
        alert(`최대 ${max}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      const { length } = newFiles;
      for (let i = 0; i < length; i++) {
        UploadImage(newFiles[i], ([imageUrl, imageId], e) => {
          if (e) {
            console.error("Error occured");
            return;
          }
          setImages((prev) => [
            ...prev,
            {
              imageUrl: imageUrl,
              imageId: imageId,
            },
          ]);
        });
      }
    }
  };

  const swiperProps = {
    modules: [Pagination],
    // onSlideChange: (e) => setCurrentIndex(e.activeIndex),
    slidesPerView: 4,
    spaceBetween: 12,
    pagination: {
      clickable: true,
    },
    wrapperClass: "pt-[10px]",
  };
  if (!isMounted || !Swiper || !SwiperSlide)
    return <p> 이미지 슬라이더 로딩 .. </p>; // 나중에 스켈레톤 애니메이션 대체하기
  return (
    <Swiper className="w-full h-[90px]" {...swiperProps}>
      {enableEdit && (
        <SwiperSlide key={0}>
          <Cell>
            {/* <div className="w-full h-full text-center font-[--color-gray-4] "> */}
            <CameraIcon />
            <p>
              <span>{images.length}</span>/<span>{max}</span>{" "}
            </p>
            {/* </div> */}
            <input
              type="file"
              className="hidden"
              onChange={onChangeImage}
              ref={imageInputRef}
            />
          </Cell>
        </SwiperSlide>
      )}
      {images.map(({ imageUrl, imageId }, i) => (
        <SwiperSlide key={++i}>
          <Cell enableEdit={enableEdit}>
            <Image src={imageUrl} alt={imageId} width={80} height={80} />
          </Cell>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

type CellProps = enableEditType & {
  children: React.ReactNode;
};
// SwiperSlide는 Swiper 컴포넌트와 같은 레벨에서 사용해야 정상적으로 랜더링 됨으로 Cell로 빼지 않음
const Cell = ({ children, enableEdit }: CellProps) => (
  <div className="w-[80px] h-[80px] flex flex-col items-center justify-center content-center text-center bg-gray-200 rounded-lg cursor-pointer">
    {enableEdit && (
      <Image
        src="/X.svg"
        alt="delete"
        className="absolute z-1 top-[-9] right-[-9] cursor-pointer"
        width={18}
        height={18}
      />
    )}
    {children}
  </div>
);

// common type for components
type enableEditType = {
  enableEdit?: boolean;
};

const CameraIcon = () => (
  <Image src="/camera.svg" alt="사진 업로드" width={48} height={48} />
);

export default ImageList;
