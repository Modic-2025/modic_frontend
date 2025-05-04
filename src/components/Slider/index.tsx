"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useEffect, useState } from "react";

const Slider = (props: { items: Array<string> }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState<number>(3);

  useEffect(() => {
    if (props.items && props.items.length > 0) {
      setLength(props.items.length);
    }
  }, props.items);

  return (
    <Swiper
      modules={[Navigation]}
      onSlideChange={(e) => setCurrentIndex(e.activeIndex)}
      className="w-full h-80 bg-gray-200 rounded-lg"
    >
      <SwiperSlide> Slide 1</SwiperSlide>
      <SwiperSlide> Slide 2</SwiperSlide>
      <SwiperSlide> Slide 3</SwiperSlide>
      <div className="absolute right-2 bottom-2 bg-white rounded-lg px-3 text-stone-400 font-medium">
        {currentIndex + 1}/{length}
      </div>
    </Swiper>
  );
};

export default Slider;
