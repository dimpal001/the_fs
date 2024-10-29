'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../context/UserContext'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import Loading from '../../Components/Loading'
import { Edit, EyeIcon, Trash2 } from 'lucide-react'
import Input from '@/app/Components/Input'
import ReviewPostModal from '@/app/Components/components/ReviewPostModal'
import DeleteModal from '@/app/Components/DeleteModal'
import useAuth from '@/app/context/useAuth'
import { Helmet } from 'react-helmet'

const MyPosts = () => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isReviewPostModalOpen, setIsReviewPostModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const { user } = useUserContext()
  const router = useRouter()

  useAuth()

  const handleFetchMyPosts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/posts', {
        params: {
          userId: user.id,
        },
      })
      setPosts(response.data)
      setFilteredPosts(response.data)
    } catch (error) {
      // enqueueSnackbar('Failed to fetch posts.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchMyPosts()
  }, [])

  useEffect(() => {
    // Filter posts based on search term and status filter
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'All' || post.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFilteredPosts(filtered)
  }, [searchTerm, statusFilter, posts])

  const handleEditClick = (id) => {
    router.push(`/user/edit-post/${id}`)
  }

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/posts/`, {
        params: { id: selectedPost.id },
      })

      setIsDeleteModalOpen(false)

      // Filter out the deleted post from the posts and filteredPosts arrays
      const updatedPosts = posts.filter((p) => p.id !== selectedPost.id)

      setSelectedPost(null)
      setPosts(updatedPosts)
      setFilteredPosts(updatedPosts)

      enqueueSnackbar(response.data.message, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  return (
    <div className='container mx-auto p-5'>
      {loading ? (
        <Loading />
      ) : (
        <div className='flex flex-col gap-3'>
          <Helmet>
            <title>My Posts - The Fashion Salad</title>
          </Helmet>
          <h2 className='text-2xl font-bold mb-4'>My Posts</h2>
          <div className='flex justify-between mb-4 gap-5'>
            <Input
              type='text'
              placeholder='Search posts...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='border rounded-sm p-2'
            >
              <option value='All'>All</option>
              <option value='approve'>Published</option>
              <option value='draft'>Draft</option>
              <option value='pending'>Pending</option>
              <option value='reject'>Rejected</option>
              <option value='deactivated'>Deactivated</option>
              {/* Add more statuses as needed */}
            </select>
          </div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <BlogPostCard
                key={index}
                post={post}
                onClick={() => handleEditClick(post.id)}
                handleShowReview={() => {
                  setSelectedPost(post)
                  setIsReviewPostModalOpen(true)
                }}
                openDeleteModal={() => {
                  setIsDeleteModalOpen(true)
                  setSelectedPost(post)
                }}
              />
            ))
          ) : (
            <p>No posts found.</p>
          )}
          {isReviewPostModalOpen && (
            <ReviewPostModal
              isOpen={true}
              onClose={() => setIsReviewPostModalOpen(false)}
              post={selectedPost}
            />
          )}
          {isDeleteModalOpen && (
            <DeleteModal
              onOpen={true}
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </div>
  )
}

const BlogPostCard = ({ post, onClick, handleShowReview, openDeleteModal }) => {
  const { title, created_at, updated_at, status } = post

  return (
    <div className='border rounded-sm hover:bg-zinc-50 overflow-hidden'>
      <div className='p-5'>
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        <div className='flex justify-between max-md:flex-col lg:items-center max-md:gap-5'>
          <div className='flex mt-3 gap-5 items-center'>
            <p className='text-gray-500'>
              <span className='font-medium'>Created At:</span>{' '}
              {new Date(created_at).toLocaleDateString()}
            </p>
            <p className='text-gray-500'>
              <span className='font-medium'>Updated At:</span>{' '}
              {new Date(updated_at).toLocaleDateString()}
            </p>
            <p className='text-green-600 capitalize'>{status}</p>
          </div>
          <div className='flex gap-5'>
            <button title='Edit' onClick={onClick}>
              <Edit
                className='text-zinc-500 cursor-pointer hover:text-first'
                title='Edit'
              />
            </button>
            <button onClick={handleShowReview} title='Preview'>
              <EyeIcon className='text-zinc-500 cursor-pointer hover:text-first' />
            </button>
            <button onClick={openDeleteModal} title='Preview'>
              <Trash2 className='text-red-600 cursor-pointer hover:text-first' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPosts
