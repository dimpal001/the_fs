import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import Img from '../assets/durga-puja-outfit-banner-image.webp'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './styles.css'

// import required modules
import { Pagination, Navigation } from 'swiper/modules'
import Image from 'next/image'

export default function MySwiper() {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className='mySwiper'
      >
        <SwiperSlide>
          <Image
            src={Img}
            width={500}
            className='w-[80%] img'
            alt='Image'
            height={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={Img}
            width={500}
            className='w-[80%] img'
            alt='Image'
            height={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={Img}
            width={500}
            className='w-[80%] img'
            alt='Image'
            height={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={Img}
            width={500}
            className='w-[80%] img'
            alt='Image'
            height={100}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={Img}
            width={500}
            className='w-[80%] img'
            alt='Image'
            height={100}
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}
