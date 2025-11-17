"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function MockupSlider() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      loop={true}
      className="rounded-xl"
    >
      <SwiperSlide>
        <img src="/mockups/mockup1.png" className="h-64 w-full object-cover rounded-xl" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/mockups/mockup2.png" className="h-64 w-full object-cover rounded-xl" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/mockups/mockup3.png" className="h-64 w-full object-cover rounded-xl" />
      </SwiperSlide>
    </Swiper>
  );
}
