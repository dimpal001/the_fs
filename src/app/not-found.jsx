'use client'

import React, { useEffect, useState } from 'react'
import { Ban, OctagonAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import BlogPostCard from './Components/BlogPostCard'
import LoadMore from './Components/LoadMore'
import Image from 'next/image'
import ErrorImg from '../../public/icons/404.png'

const ErrorPage = ({ label }) => {
  const router = useRouter()
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/home-data', {
        params: { status: 'category_1' },
      })
      setPosts(response.data)
    } catch (error) {
      enqueueSnackbar('Failed fetching posts')
    }
  }

  const handleLoadMore = (slug) => {
    router.push(`/category/${slug}`)
  }

  useEffect(() => {
    fetchPosts()
  }, [])
  return (
    <div>
      <div className='min-h-[400px] flex flex-col gap-1 justify-center items-center'>
        <div className='rounded-2xl max-lg:w-[250px] mb-10 lg:w-[370px]'>
          <Image
            className='rounded-t-2xl'
            src={ErrorImg}
            width={0}
            height={0}
            sizes='100vw'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer',
            }}
            alt={'Error page'}
          />
        </div>
        <p
          onClick={() => router.push('/')}
          className='text-first cursor-pointer font-semibold italic'
        >
          Back to Home
        </p>
      </div>
      <div className='min-h-[200px] max-md:px-6 container mx-auto'>
        {posts.length > 0 && (
          <div>
            <h2 className='text-6xl max-md:text-3xl font-[900]'>
              Suggested Posts
            </h2>
            <div className='grid pt-10 gap-16 grid-cols-2 max-md:grid-cols-1'>
              {posts?.map((post, index) => (
                <BlogPostCard
                  key={index}
                  post={post}
                  imageUrl={`https://picsum.photos/458/9${index}7`}
                />
              ))}
            </div>
            <div className='mt-10'>
              <LoadMore
                onClick={() => handleLoadMore(posts[0].category_ids[0])}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorPage
