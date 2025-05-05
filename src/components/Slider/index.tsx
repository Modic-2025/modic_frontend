"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageType } from "@/app/(title-and-backward)/art/regist/page";

const Slider = (props: {
  items: Array<ImageType>;
  maxItemNum?: number;
  children?: React.ReactNode;
}) => {
  const { items, maxItemNum = 1, children } = props;
  const isMaxItemNumUsed = maxItemNum <= 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState<number>(maxItemNum);

  useEffect(() => {
    if (isMaxItemNumUsed && items && items.length > 0) {
      setLength(items.length);
    }
  }, [items]);

  const currentIndexView = isMaxItemNumUsed ? currentIndex : currentIndex + 1;

  return (
    <Swiper
      modules={[Navigation]}
      onSlideChange={(e) => setCurrentIndex(e.activeIndex)}
      className="w-full h-80 bg-gray-200 rounded-lg"
    >
      {items &&
        items.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <div className="w-full h-full relative">
              <Image
                src={item.imageUrl}
                alt={item.imageUrl}
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
      <div className="absolute right-2 bottom-2 bg-white rounded-lg px-3 text-stone-400 font-medium z-1">
        {currentIndexView}/{maxItemNum}
      </div>
    </Swiper>
  );
};

export default Slider;
