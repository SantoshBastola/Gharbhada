import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";

import rental_1 from "../public/images/rental_1.jpg";
import rental_2 from "../public/images/rental_2.jpg";
import rental_3 from "../public/images/rental_3.jpg";

const SliderImage = (props) => {
  return (
    <div className='h-[90vh] w-screen relative'>
      <img src={props.img} alt={props.name} className="h-full w-full object-cover" />
      <div className='absolute top-0 left-0 h-full w-full bg-black bg-opacity-50'></div>
    </div>
  )
};

const Banner = () => {
  return (
    <div>
      <Swiper
        modules={[Autoplay]}
        loop={Infinity}
        autoplay={{ delay: 7000, disableOnInteraction: false }}>
        <SwiperSlide>
          <SliderImage img={rental_1} alt="rental 1" />
        </SwiperSlide>
        <SwiperSlide>
          <SliderImage img={rental_2} alt="rental 2" />
        </SwiperSlide>
        <SwiperSlide>
          <SliderImage img={rental_3} alt="rental 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Banner;