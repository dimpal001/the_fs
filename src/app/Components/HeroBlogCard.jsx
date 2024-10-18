import Image from 'next/image'
import React from 'react'

const HeroBlogCard = ({ imageUrl, delay }) => {
  return (
    <div
      className={`flex animate__animated animate__fadeInUp animate__delay-${delay}s animate__faster relative z-20 bg-white p-3 shadow-md rounded-md gap-3`}
    >
      <div className='w-[150px] h-[80px] rounded-md'>
        <Image
          src={imageUrl}
          width={0}
          height={0}
          sizes='100vw'
          className='rounded-md'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          alt={'Image'}
        />
      </div>
      <div>
        <p className='font-semibold hover:text-first text-lg leading-[20px] pb-1'>
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <p className='text-xs'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
          earum eveniet accusantium.
        </p>
      </div>
    </div>
  )
}

export default HeroBlogCard
