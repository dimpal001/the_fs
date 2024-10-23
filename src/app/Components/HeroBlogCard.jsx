import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const HeroBlogCard = ({ imageUrl, delay, post }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/blogs/${post?.slug}`)
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }
  return (
    <div
      className={`flex animate__animated animate__fadeInUp animate__delay-${delay}s animate__faster relative z-20 bg-white p-3 shadow-md rounded-md gap-3`}
    >
      <div className='w-[150px] max-md:w-[100px] h-[80px] rounded-md'>
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
        <h3
          onClick={handleClick}
          className='font-semibold cursor-pointer hover:text-first text-lg leading-[20px] pb-1'
        >
          {post?.title || 'Lorem ipsum dolor sit amet consectetur.'}
        </h3>
        <p className='text-xs'>
          {stripHtml(post?.content) ||
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis earum eveniet accusantium.'}
        </p>
      </div>
    </div>
  )
}

export default HeroBlogCard
