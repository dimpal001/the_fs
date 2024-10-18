'use client'

import { useCategoryContext } from '@/app/context/CategoryContext'
import Image from 'next/image'
import Img from '../../assets/durga-puja-outfit-banner-image.webp'
import { categoryList } from '@/app/data'
import { useEffect, useState } from 'react'
import ProfileCard from '@/app/Components/ProfileCard'
import { useBlogContext } from '@/app/context/BlogContext'
import { useRouter } from 'next/navigation'
import { Helmet } from 'react-helmet'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import Loading from '@/app/Components/Loading'
import DataNotFound from '@/app/Components/DataNotFound'
import BlogPostCard4 from '@/app/Components/BlogPostCard4'

const CategoryBlog = () => {
  const { selectedCategoryId } = useCategoryContext()
  const { setSelectedPostId } = useBlogContext()
  const [posts, setPosts] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleFetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/posts/category`, {
        params: { id: selectedCategoryId },
      })
      console.log(response.data)
      setPosts(response.data.posts)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedCategoryName = localStorage.getItem('selectedCategoryName')
    setCategoryName(storedCategoryName)
    // if (storedCategoryName) {
    //   const parsedCategoryName = JSON.parse(storedCategoryName)
    // }
    handleFetchPosts()
  }, [selectedCategoryId, categoryName])

  useEffect(() => {
    const filteredCategory = categoryList.find(
      (category) => category.id === selectedCategoryId
    )
    if (filteredCategory) {
      setPosts(filteredCategory.posts)
    } else {
      setPosts([])
    }
    setCategoryName(filteredCategory?.name)
  }, [selectedCategoryId])

  const handleClick = (post) => {
    const formattedTitle = post.title
      .toLowerCase()
      .replace(/[?/:;'&*$#%.,!]/g, '')
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .trim()

    setSelectedPostId(post.id)
    router.push(`/blogs/${formattedTitle}`)
  }

  return (
    <div className='container px-10 mx-auto'>
      {/* Using Head component for dynamic title */}
      <Helmet>
        <title>{categoryName || 'Blog category - The fashion salad'}</title>
      </Helmet>

      {loading ? (
        <Loading />
      ) : (
        <div>
          {posts.length > 0 ? (
            <div>
              {/* First block  */}
              <div className='flex flex-col lg:gap-10 gap-8 pb-10'>
                <h1 className='capitalize font-semibold lg:text-5xl text-2xl pt-7'>
                  {categoryName && categoryName}
                </h1>
                <div className='h-[1px] bg-gray-300'></div>
              </div>

              {/* Grid block  */}
              <div className='grid max-md:grid-cols-1 grid-cols-3 gap-7'>
                {posts.length > 0 &&
                  posts.map((post, index) => (
                    <BlogPostCard4
                      post={post}
                      imageUrl={'https://picsum.photos/300/300'}
                      key={index}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <DataNotFound />
          )}
        </div>
      )}
    </div>
  )
}

function extractPlainText(html) {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  const plainText = tempDiv.textContent || tempDiv.innerText || ''

  return plainText.trim()
}

const FirstPost = ({ post }) => {
  return (
    <div className='flex gap-5'>
      <Image className='border border-gray-600' src={Img} alt='Image' />
      <div className='p-7'>
        <p className='text-3xl font-semibold'>{post?.title}</p>
        <p className='py-5 text-base text-gray-600'>
          {' '}
          {extractPlainText(post?.content)}
        </p>
        <ProfileCard />
      </div>
    </div>
  )
}

const Post = ({ post, onClick }) => {
  return (
    <div
      onClick={onClick}
      data-aos='fade-up'
      className='hover:bg-pink-50 cursor-pointer'
    >
      <div>
        <Image className='border border-gray-600' src={Img} alt='Post Image' />
        <div className='p-3'>
          <p className='font-light text-xl'>{post.title}</p>
          <p className='font-light text-sm pt-3'>
            {extractPlainText(post?.content)}
          </p>
        </div>
        <div className='px-3 pb-3'>
          <ProfileCard />
        </div>
      </div>
    </div>
  )
}

export default CategoryBlog
