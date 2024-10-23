'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Loading from '@/app/Components/Loading'
import Image from 'next/image'
import { useUserContext } from '@/app/context/UserContext'
import { enqueueSnackbar } from 'notistack'
import BlogPostCard4 from '@/app/Components/BlogPostCard4'
import { useRouter } from 'next/navigation'
import ImageModal from '@/app/Components/ImageModal'

const Profile = ({ params }) => {
  const [userData, setUserData] = useState(null)
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchingPosts, setFetchingPosts] = useState(false)
  const [error, setError] = useState(null)
  const [followers, setFollowers] = useState(null)
  const [noOfPosts, setNoOfPosts] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(null)

  const id = params.id
  const { user } = useUserContext()
  const sectionRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data, including following status
        const response = await axios.get(
          `/api/followers?user_id=${id}&loggedInUserId=${user?.id || ''}`
        )
        setUserData(response.data.user)
        setFollowers(response.data.followerCount)
        setNoOfPosts(response.data.blogPostCount)
        setIsFollowing(response.data.isFollowing)
      } catch (err) {
        setError(
          err.response ? err.response.data.message : 'Error fetching data'
        )
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user?.id])

  if (loading) return <Loading />

  const handleFollow = async () => {
    if (!user) {
      enqueueSnackbar('Please login first', { variant: 'error' })
      return
    }

    try {
      const response = await axios.post('/api/followers', {
        follower_id: user.id,
        following_id: id,
      })

      if (response.status === 200) {
        setFollowers((prev) => prev + 1)
        setIsFollowing(true)
        enqueueSnackbar('You are now following this user', {
          variant: 'success',
        })
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Error following user',
        { variant: 'error' }
      )
    }
  }

  const handleUnfollow = async () => {
    if (!user) {
      enqueueSnackbar('Please login first', { variant: 'error' })
      return
    }

    try {
      // Sending unfollow request
      const response = await axios.delete('/api/followers', {
        data: {
          follower_id: user.id,
          following_id: id,
        },
      })

      if (response.status === 200) {
        // Successfully unfollowed
        setFollowers((prev) => prev - 1)
        setIsFollowing(false)
        enqueueSnackbar('You have unfollowed this user', {
          variant: 'success',
        })
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Error unfollowing user',
        { variant: 'error' }
      )
    }
  }

  const handleFetchPosts = async () => {
    try {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
      setFetchingPosts(true)
      const response = await axios.get('/api/posts/user-posts', {
        params: { id: userData.id, page: currentPage, status: 'approve' },
      })
      setBlogPosts(response.data.posts)
      setCurrentPage(response.data.currentPage)
      setTotalPage(response.data.totalPage)
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    } finally {
      setFetchingPosts(false)
    }
  }

  return (
    <div>
      <div className='min-h-[650px] relative flex items-center justify-center bg-neutral-50'>
        <div className='lg:w-[60%] relative z-20 w-[90%] lg:p-14 p-6 shadow-xl rounded-3xl bg-white'>
          <div className='lg:-mt-32 -mt-16'>
            {/* Image  */}
            <div className='flex justify-center'>
              <div
                onClick={() => {
                  setImageUrl(
                    `https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/profile-pictures/${userData?.image_url}`
                  )
                  setImageModalOpen(true)
                }}
                className='w-[120px] border-4 border-blue-500 h-[120px] rounded-full lg:h-[180px] lg:w-[180px]'
              >
                <Image
                  className='rounded-full w-full h-full object-cover cursor-pointer'
                  src={`https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/profile-pictures/${userData?.image_url}`}
                  width={0}
                  height={0}
                  sizes='100vw'
                  alt={'User Profile'}
                />
              </div>
            </div>
            {/* Name  */}
            <h1 className='lg:text-5xl text-4xl p-5 font-semibold text-neutral-600 text-center'>
              {userData?.name ? userData?.name : 'Anonymous'}
            </h1>
            <p className='text-sm text-neutral-500 text-center'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
            <div className='flex justify-center gap-10 p-7'>
              <p className='font-semibold max-md:text-xs max-md:text-center tracking-wide'>
                {followers} Followers
              </p>
              <p className='font-semibold max-md:text-xs max-md:text-center tracking-wide'>
                {noOfPosts} Posts
              </p>
            </div>
            <div className='flex justify-center gap-5 p-3'>
              {user?.id !== userData.id && (
                <button
                  title='Follow'
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className='p-2 max-md:text-sm px-6 font-semibold rounded-full bg-gradient-to-br from-pink-600 to-blue-700 text-white text-lg'
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}{' '}
                  {/* Change button text based on following status */}
                </button>
              )}
              <button
                title='Show Posts'
                onClick={handleFetchPosts}
                className='p-2 max-md:text-sm px-6 font-semibold rounded-full bg-first text-white text-lg'
              >
                Show Posts
              </button>
            </div>
          </div>
        </div>
        <div className='absolute top-0 right-0 left-0 h-full z-10'>
          <div className='h-1/2 bg-gradient-to-b from-pink-300 to-neutral-50'></div>
          <div></div>
        </div>
      </div>

      {imageModalOpen && (
        <ImageModal
          isOpen={true}
          onClose={() => setImageModalOpen(false)}
          imageUrl={imageUrl}
        />
      )}

      <div className='container mx-auto py-10 p-5'>
        {fetchingPosts && <Loading />}
        <div
          ref={sectionRef}
          className='grid max-md:grid-cols-1 grid-cols-3 gap-16'
        >
          {blogPosts.length > 0 &&
            blogPosts.map((post, index) => (
              <BlogPostCard4
                key={post.id}
                post={post}
                imageUrl={`https://picsum.photos/67${index}/624`}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
