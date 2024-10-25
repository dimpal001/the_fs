// components/BlogPost.jsx

'use client'

import Image from 'next/image'
import Img from '../assets/durga-puja-outfit-banner-image.webp'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BlogPost = ({ post }) => {
  const router = useRouter()

  useEffect(() => {
    AOS.init()
  }, [])

  const formattedTitle = post.title
    .toLowerCase()
    .replace(/[?/:;'&*$#%.,!]/g, '')
    .replace(/ /g, '-')
    .replace(/--+/g, '-')
    .trim()

  const handleClick = () => {
    router.push(`/blogs/${formattedTitle}`)
  }

  return (
    <div onClick={handleClick} className='hover:bg-pink-50 cursor-pointer'>
      <div data-aos='fade-up'>
        <Image src={Img} alt='image' />
        <div className='p-3'>
          <p className='font-light text-xl'>{post.title}</p>
          <p className='font-light text-sm pt-3'>{post.description}</p>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
