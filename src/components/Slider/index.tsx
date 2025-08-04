"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageType } from "@/app/art/regist/page";

type layoutType = "DEFAULT" | "PANORAMA";

const Slider = (props: {
  items: Array<ImageType | string>;
  maxItemNum?: number;
  children?: React.ReactNode;
  type?: layoutType;
}) => {
  const { items, maxItemNum = 1, children, type = "DEFAULT" } = props;
  const isMaxItemNumUsed = maxItemNum <= 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState<number>(maxItemNum);

  useEffect(() => {
    if (isMaxItemNumUsed && items && items.length > 0) {
      setLength(items.length);
    }
  }, [items]);

  // const currentIndexView = isMaxItemNumUsed ? currentIndex : currentIndex + 1;

  const isPANORAMA = type == "PANORAMA";

  const swiperClassName = `w-full rounded-lg ${isPANORAMA ? "h-[100px]" : "h-80"}`;
  const swiperProps = {
    modules: [Navigation],
    className: swiperClassName,
    onSlideChange: (e) => setCurrentIndex(e.activeIndex),
    slidesPerView: isPANORAMA && 3,
    spaceBetween: isPANORAMA && 12,
    pagination: {
      clickable: true,
    },
  };

  return (
    <Swiper {...swiperProps}>
      {items &&
        items.map((item, index) => (
          <SwiperSlide
            key={typeof item == "string" ? item : item.imageUrl}
            className="flex justify-center items-center"
          >
            <div className="w-full h-full relative">
              <Image
                src={typeof item == "string" ? item : item.imageUrl}
                alt={typeof item == "string" ? item : item.imageUrl}
                // width={100}
                // height={100}
                className="rounded-lg"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </SwiperSlide>
        ))}
      {children && (
        <SwiperSlide className="flex justify-center items-center">
          {children}
        </SwiperSlide>
      )}
      <div className="absolute right-2 bottom-2 bg-(--color-gray-1) rounded-lg px-3 text-stone-400 font-medium z-10">
        {currentIndex + 1}/{maxItemNum}
      </div>
    </Swiper>
  );
};

export default Slider;
