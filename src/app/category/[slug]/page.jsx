'use client'

import { useCategoryContext } from '@/app/context/CategoryContext'
import Image from 'next/image'
import Img from '../../assets/durga-puja-outfit-banner-image.webp'
import { categoryList } from '@/app/data'
import { useEffect, useState } from 'react'
import ProfileCard from '@/app/Components/ProfileCard'
import { useRouter } from 'next/navigation'
import { Helmet } from 'react-helmet'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import Loading from '@/app/Components/Loading'
import DataNotFound from '@/app/Components/DataNotFound'
import BlogPostCard4 from '@/app/Components/BlogPostCard4'

const CategoryBlog = ({ params }) => {
  const { selectedCategoryId } = useCategoryContext()
  const [posts, setPosts] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [currentPage, setCurrentPage] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [totalPosts, setTotalPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const slug = params.slug

  const handleFetchPosts = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/posts/category`, {
        params: { slug: slug, page: page },
      })
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts])
      console.log(response.data)
      setCategoryName(response.data.categoryName)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setTotalPosts(response.data.totalPosts)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchPosts(currentPage)
  }, [])

  // useEffect(() => {
  //   // const filteredCategory = categoryList.find(
  //   //   (category) => category.id === selectedCategoryId
  //   // )
  //   // if (filteredCategory) {
  //   //   setPosts(filteredCategory.posts)
  //   // } else {
  //   //   setPosts([])
  //   // }
  //   setCategoryName(filteredCategory?.name)
  // }, [slug, currentPage])

  const handleClick = (post) => {
    router.push(`/blogs/${post?.slug}`)
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const newPage = parseInt(currentPage) + 1
      setCurrentPage(newPage)
      handleFetchPosts(newPage)
    }
  }

  if (loading && posts.length === 0) {
    return <Loading />
  }

  return (
    <div className='container px-10 mx-auto'>
      {/* Using Head component for dynamic title */}
      <Helmet>
        <title>{categoryName || 'Blog category - The fashion salad'}</title>
      </Helmet>

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
                    imageUrl={`https://picsum.photos/3${index}8/340`}
                    key={index}
                  />
                ))}
            </div>
            <div onClick={handleLoadMore} className='flex mt-10 justify-center'>
              {totalPosts > posts.length && (
                <button className='text-lg px-5 py-2 border hover:bg-first hover:text-white font-thin border-first rounded-none text-first border-dotted'>
                  Load More
                </button>
              )}
            </div>
          </div>
        ) : (
          <DataNotFound />
        )}
      </div>
    </div>
  )
}

export default CategoryBlog
