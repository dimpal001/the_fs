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

const Blog = ({ params }) => {
  const { setSelectedCategoryId } = useCategoryContext()
  const { user } = useUserContext()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replies, setReplies] = useState([])
  const [relatedPosts, setRelatedPosts] = useState([])
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const relatedPostsTrigger = useRef(null)

  const [hasLiked, setHasLiked] = useState(false)
  const [slug, setSlug] = useState(params.slug)

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
    console.log(user?.id)
    try {
      if (!user) {
        enqueueSnackbar('Please login first')
        return
      }
      const response = await axios.post('/api/posts/likes', {
        user_id: user.id,
        blog_post_id: post.id,
      })

      if (response.status === 200) {
        setPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes + 1,
        }))
        setHasLiked(true)
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
  const fetchRelatedPosts = async (categoryIds) => {
    try {
      const response = await axios.get(`/api/posts/related`, {
        params: { category_id: categoryIds },
      })
      setRelatedPosts(response.data)
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && post) {
          localStorage.getItem('selectedCategoryId')
          fetchRelatedPosts(localStorage.getItem('selectedCategoryId'))
        }
      },
      { threshold: 1.0 }
    )

    if (relatedPostsTrigger.current) {
      observer.observe(relatedPostsTrigger.current)
    }

    return () => {
      if (relatedPostsTrigger.current) {
        observer.unobserve(relatedPostsTrigger.current)
      }
    }
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
      console.log('Category not found')
    }
  }

  function extractPlainText(html) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const plainText = tempDiv.textContent || tempDiv.innerText || ''

    return plainText.trim()
  }

  return (
    <div>
      {!loading ? (
        <div>
          <Helmet>
            <title>{post?.title}</title>
            <meta
              name='description'
              content={extractPlainText(post?.content?.slice(0, 500))}
            />
          </Helmet>

          {/* New design  */}
          <div className='lg:flex lg:gap-10 lg:p-10 p-5 lg:px-20'>
            <div className='lg:w-2/3'>
              <div className='w-full h-[200px] rounded-xl lg:h-[350px]'>
                <Image
                  className='rounded-xl'
                  src={'https://picsum.photos/651/207'}
                  width={0}
                  height={0}
                  sizes='100vw'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  alt={'hh'}
                />
              </div>
              <div className='flex p-2 justify-between items-center'>
                <ProfileCard name={post?.author_name} id={post?.author_id} />
                <div className='flex gap-7 items-center text-sm max-md:text-xs text-neutral-600'>
                  <p>{post?.views} Views</p>
                  <div className='flex gap-1 items-center'>
                    <Heart
                      className='cursor-pointer'
                      size={20}
                      color='red'
                      fill={hasLiked ? 'red' : 'white'}
                      onClick={hasLiked ? handleRemoveLike : handleLike}
                    />
                    {post?.likes} Likes
                  </div>
                </div>
              </div>
              <div className='p-3 font-serif'>
                <h1 className='text-6xl max-md:text-3xl font-semibold'>
                  {post?.title}
                </h1>
                <div
                  className='mt-3 max-md:text-lg max-md:text-justify text-2xl leading-[38px] tracking-wide text-neutral-600'
                  dangerouslySetInnerHTML={{ __html: post?.content }}
                />
              </div>

              {/* Replies Section */}
              <Replies replies={replies} postId={post?.id} />

              {/* Trigger for related posts */}
              <div ref={relatedPostsTrigger} className='h-1'></div>
            </div>
            <div className='max-md:mt-5'>
              <SubscribeCard />
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Blog
