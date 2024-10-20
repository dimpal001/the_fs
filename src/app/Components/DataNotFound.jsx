import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import NotFoundImg from '../../../public/icons/not-found.svg'
import { Ban, OctagonAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import BlogPostCard from './BlogPostCard'
import LoadMore from './LoadMore'

const DataNotFound = ({ label }) => {
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
        <OctagonAlert size={100} className='text-first' />
        <p className='lg:text-sm text-base text-zinc-500 tracking-wider'>
          {label ? label : 'No data found to display!'}
        </p>
        <p
          onClick={() => router.push('/')}
          className='text-first cursor-pointer font-semibold italic'
        >
          Home
        </p>
      </div>
      <div className='min-h-[200px]'>
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
            <LoadMore
              onClick={() => handleLoadMore(posts[0].category_ids[0])}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DataNotFound
