'use client'

import Image from 'next/image'
import ProfileCard from '@/app/Components/ProfileCard'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import Loading from '@/app/Components/Loading'
import { useUserContext } from '@/app/context/UserContext'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Helmet } from 'react-helmet'
import SubscribeCard from '@/app/Components/SubscribeCard'
import Replies from '@/app/Components/Replies'
import HeroBlogCard from '@/app/Components/HeroBlogCard'
import DataNotFound from '@/app/Components/DataNotFound'
import ImageModal from '@/app/Components/ImageModal'
import { blogUrl } from '@/app/Components/url'

const BlogPostPage = ({ post, slug }) => {
  const { user } = useUserContext()
  const [loading, setLoading] = useState(false)
  const [notfound, setNotfound] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [replies, setReplies] = useState([])
  const [relatedPosts, setRelatedPosts] = useState([])
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const relatedPostsTrigger = useRef(null)

  const [hasLiked, setHasLiked] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)

  let tags

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
    // handleFetchBlogPost(slug)
  }, [slug])

  // Fetch replies for the current post
  const fetchReplies = async (postId) => {
    try {
      const response = await axios.get(`/api/replies`, {
        params: { blog_post_id: postId },
      })
      setReplies(response.data)
    } catch (error) {}
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
    } catch (error) {}
  }

  useEffect(() => {
    setTimeout(() => {
      fetchRelatedPosts(post?.category_ids[0])
    }, 1000)
  }, [post])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

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
          {/* Standard meta tags */}
          <title>{post?.title}</title>
          <meta
            name='description'
            content={extractPlainText(post?.content?.slice(0, 500))}
          />

          {/* Open Graph meta tags for social media sharing */}
          <meta property='og:title' content={post?.title || 'Default Title'} />
          <meta
            property='og:description'
            content={
              extractPlainText(post?.content?.slice(0, 500)) ||
              'Default description'
            }
          />
          <meta property='og:image' content={blogUrl + post?.image_url} />
          <meta
            property='og:url'
            content={`https://thefashionsalad.com/blogs/${post?.slug}`}
          />
          <meta property='og:type' content='article' />

          {/* Twitter meta tags (optional) */}
          <meta name='twitter:card' content='summary_large_image' />
          <meta
            name='twitter:title'
            content={post?.title || 'The Fashion Salad'}
          />
          <meta
            name='twitter:description'
            content={
              extractPlainText(post?.content?.slice(0, 500)) ||
              'Default description'
            }
          />
          <meta name='twitter:image' content={blogUrl + post?.image_url} />

          <meta
            name='keywords'
            content={
              post?.tags?.length
                ? post.tags.join(', ')
                : 'fashion blog, tips, trends, blog, trending blog, blog, fashion, men clothing, women clothing, kid clothing, wedding, festives'
            }
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
                className='w-full aspect-video border rounded-xl'
              >
                <Image
                  className='rounded-xl aspect-video object-cover cursor-pointer'
                  src={blogUrl + post?.image_url}
                  width={1280}
                  height={720}
                  // sizes='100vw'
                  alt={post?.title || 'Blog title'}
                />
              </div>
              <div className='flex p-2 justify-between items-center'>
                <ProfileCard
                  name={post?.author_name}
                  id={post?.author_id}
                  author_image={post?.author_image}
                  r={post?.author_role}
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
                <h1 className='text-5xl rozha pb-3 max-md:text-3xl font-semibold'>
                  {post?.title}
                </h1>
                <div
                  className='mt-3 editor-content crimson max-md:text-lg text-xl leading-[34px] tracking-wide text-neutral-700'
                  dangerouslySetInnerHTML={{ __html: post?.content }}
                />
              </div>

              {/* {post?.author_role === 'admin' && ( */}
              <p className='italic text-neutral-600 p-3 capitalize'>
                Posted by{' '}
                <strong>
                  {post?.author_role === 'admin' ? 'admin' : 'member'}
                </strong>
              </p>
              {/* )} */}

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
            imageUrl={post?.image_url}
          />
        )}
      </div>
    </div>
  )
}

export default BlogPostPage
