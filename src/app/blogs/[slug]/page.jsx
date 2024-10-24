'use client'

import Image from 'next/image'
import ProfileCard from '@/app/Components/ProfileCard'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import Loading from '@/app/Components/Loading'
import TextArea from '@/app/Components/TextArea'
import Button from '@/app/Components/Button'
import { useUserContext } from '@/app/context/UserContext'
import { useCategoryContext } from '@/app/context/CategoryContext'
import { Forward, Heart, Trash2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Helmet } from 'react-helmet'
import SubscribeCard from '@/app/Components/SubscribeCard'
import Avatar from '@/app/Components/Avatar'
import Replies from '@/app/Components/Replies'
import HeroBlogCard from '@/app/Components/HeroBlogCard'
import DataNotFound from '@/app/Components/DataNotFound'
import ImageModal from '@/app/Components/ImageModal'
import { blogUrl } from '@/app/Components/url'

const Blog = ({ params }) => {
  const { setSelectedCategoryId } = useCategoryContext()
  const { user } = useUserContext()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notfound, setNotfound] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [replies, setReplies] = useState([])
  const [relatedPosts, setRelatedPosts] = useState([])
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const relatedPostsTrigger = useRef(null)

  const [hasLiked, setHasLiked] = useState(false)
  const [slug, setSlug] = useState(params.slug)
  const [likeAnimation, setLikeAnimation] = useState(false)

  // Fetch the blog post and its replies
  const handleFetchBlogPost = async (slug) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/posts/`, {
        params: { slug: slug, viewerId: user?.id || '', status: 'view' },
      })
      setPost(response.data.post)
      setHasLiked(response.data.hasLiked)
      fetchReplies(response.data.post.id)
      setSelectedCategoryId(post.category_ids)
    } catch (error) {
      setNotfound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {
      enqueueSnackbar('Faild fetching categories', { variant: 'error' })
    }
  }

  const handleLike = async () => {
    if (!user) {
      enqueueSnackbar('Please login first')
      return
    }
    setHasLiked(true)
    setLikeAnimation(true)
    setTimeout(() => {
      setLikeAnimation(false)
    }, 300)
    try {
      const response = await axios.post('/api/posts/likes', {
        user_id: user.id,
        blog_post_id: post.id,
      })

      if (response.status === 200) {
        setPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes + 1,
        }))
      }
    } catch (error) {
      // enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  const handleRemoveLike = async () => {
    try {
      const response = await axios.delete('/api/posts/likes', {
        data: {
          user_id: user.id,
          blog_post_id: post.id,
        },
      })

      if (response.status === 200) {
        setPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes - 1,
        }))
        setHasLiked(false)
      }
    } catch (error) {
      // enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  useEffect(() => {
    handleFetchCategories()
    handleFetchBlogPost(slug)
  }, [slug])

  // Fetch replies for the current post
  const fetchReplies = async (postId) => {
    try {
      const response = await axios.get(`/api/replies`, {
        params: { blog_post_id: postId },
      })
      setReplies(response.data)
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  // Fetch related posts based on category IDs
  const fetchRelatedPosts = async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/posts/related/?category_id=${categoryId}`,
        {
          params: { category_id: categoryId },
        }
      )
      setRelatedPosts(response.data)
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchRelatedPosts(post?.category_ids[0])
    }, 1000)
  }, [post])

  const handleSeeMore = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId)

    if (category) {
      const { id, name } = category

      const formattedTitle = name
        .toLowerCase()
        .replace(/[?/:;'&*$#%.,!]/g, '')
        .replace(/ /g, '-')
        .replace(/--+/g, '-')
        .trim()

      setSelectedCategoryId(id)
      localStorage.setItem('selectedCategoryId', id)
      localStorage.setItem('selectedCategoryName', name)

      router.push(`/category/${formattedTitle}`)
    } else {
    }
  }

  function extractPlainText(html) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const plainText = tempDiv.textContent || tempDiv.innerText || ''

    return plainText.trim()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div>
        <Helmet>
          <title>{post?.title}</title>
          <meta
            name='description'
            content={extractPlainText(post?.content?.slice(0, 500))}
          />
        </Helmet>

        {/* New design  */}
        {post && (
          <div className='lg:flex lg:gap-10 lg:p-10 p-5 lg:px-20'>
            <div className='lg:w-2/3'>
              <div
                onClick={() => {
                  setImageModalOpen(true)
                }}
                className='w-full h-[200px] border rounded-xl lg:h-[350px]'
              >
                <Image
                  className='rounded-xl w-full h-full object-cover cursor-pointer'
                  src={blogUrl + post?.image_url}
                  width={0}
                  height={0}
                  sizes='100vw'
                  alt={post?.title || 'Blog title'}
                />
              </div>
              <div className='flex p-2 justify-between items-center'>
                <ProfileCard
                  name={post?.author_name}
                  id={post?.author_id}
                  author_image={post?.author_image}
                />
                <div className='flex gap-7 items-center text-sm max-md:text-xs text-neutral-600'>
                  <p>{post?.views} Views</p>
                  <div className='flex gap-1 items-center'>
                    <div
                      className={`cursor-pointer ${
                        likeAnimation ? 'animate-heart-pop' : ''
                      }`}
                      onClick={hasLiked ? handleRemoveLike : handleLike}
                    >
                      <Heart
                        size={20}
                        color='red'
                        fill={hasLiked ? 'red' : 'none'}
                        className={`transition-all duration-300 ${
                          hasLiked ? 'scale-125' : ''
                        }`}
                      />
                    </div>
                    {post?.likes} Likes
                  </div>
                </div>
              </div>
              <div className='p-3 font-serif'>
                <h1 className='text-6xl max-md:text-3xl font-semibold'>
                  {post?.title}
                </h1>
                <div
                  className='mt-3 max-md:text-lg max-md:text-justify text-xl leading-[38px] tracking-wide text-neutral-600'
                  dangerouslySetInnerHTML={{ __html: post?.content }}
                />
              </div>

              {/* Replies Section */}
              <Replies replies={replies} postId={post?.id} />

              {/* Trigger for related posts */}
              <div ref={relatedPostsTrigger} className='h-1'></div>
            </div>
            <div className='max-md:mt-5 lg:w-1/3'>
              <SubscribeCard />
              <div className='w-full flex flex-col gap-4 mt-7'>
                {relatedPosts.length > 0 &&
                  relatedPosts.map((post, index) => (
                    <HeroBlogCard
                      post={post}
                      key={post.id}
                      imageUrl={`https://picsum.photos/348/9${index}4`}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
        {notfound && !post && <DataNotFound />}
        {imageModalOpen && (
          <ImageModal
            isOpen={true}
            onClose={() => setImageModalOpen(false)}
            imageUrl={''}
          />
        )}
      </div>
    </div>
  )
}

export default Blog
