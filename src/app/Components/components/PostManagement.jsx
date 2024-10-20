import axios from 'axios'
import { Loader } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import RejectPostModal from './RejectPostModal'
import ReviewPostModal from './ReviewPostModal'
import ConfirmModal from './ConfirmModal'
import Input from '@/app/Components/Input'
import Loading from '@/app/Components/Loading'
import Paggination from './Paggination'

const PostManagement = () => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isApprovingId, setIsApprovingId] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState('')
  const [selectedPost, setSelectedPost] = useState({})
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')

  const handleFetchPosts = async (page) => {
    setLoading(true)
    try {
      const response = await axios.get(
        '/api/posts',
        {
          params: { page: page },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setPosts(response.data.posts)
      setFilteredPosts(response.data.posts)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Filter posts based on status and search term
  const handleFilterPosts = () => {
    let filtered = posts

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(
        (post) => post.status === filterStatus.toLowerCase()
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
  }

  const handleApprovePost = async (post) => {
    if (post.status === 'approve') {
      return null
    }
    setIsApprovingId(post.id)
    try {
      const response = await axios.patch(
        `/api/posts/${post.id}`,
        {
          status: 'approve',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id ? { ...p, status: 'approve' } : p
        )
      )
      enqueueSnackbar(response.data.message, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setIsApprovingId(null)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = parseInt(currentPage) + 1
      setCurrentPage(newPage)
      handleFetchPosts(newPage)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = parseInt(currentPage) - 1
      setCurrentPage(newPage)
      handleFetchPosts(newPage)
    }
  }

  useEffect(() => {
    handleFetchPosts()
  }, [])

  useEffect(() => {
    handleFilterPosts(currentPage)
  }, [filterStatus, searchTerm, posts])

  const handleReviewModal = (post) => {
    setSelectedPost(post)
    setIsReviewModalOpen(true)
  }

  const handleDeactive = (post) => {
    setSelectedPost(post)
    setConfirmAction('deactivate')
    setIsConfirmModalOpen(true)
  }

  const handleDelete = (post) => {
    setSelectedPost(post)
    setConfirmAction('delete')
    setIsConfirmModalOpen(true)
  }

  const handleConfirmAction = async () => {
    if (confirmAction === 'deactivate') {
      setConfirmAction(false)
      try {
        const response = await axios.patch(`/api/posts/${selectedPost.id}`, {
          status: 'deactivated',
        })
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === selectedPost.id ? { ...p, status: 'deactivated' } : p
          )
        )
        enqueueSnackbar('Post deactivated successfully', { variant: 'success' })
      } catch (error) {
        enqueueSnackbar('Error deactivating post', { variant: 'error' })
      } finally {
        setIsConfirmModalOpen(false)
      }
    } else if (confirmAction === 'delete') {
      setConfirmAction(false)
      try {
        await axios.delete(`/api/posts/${selectedPost.id}`)
        setPosts((prevPosts) =>
          prevPosts.filter((p) => p.id !== selectedPost.id)
        )
        enqueueSnackbar('Post deleted successfully', { variant: 'success' })
      } catch (error) {
        enqueueSnackbar('Error deleting post', { variant: 'error' })
      } finally {
        setIsConfirmModalOpen(false)
      }
    }
    setIsConfirmModalOpen(false)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Posts</h2>

      <div className='flex justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <Input
            type='text'
            placeholder='Search by title...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='border rounded-sm p-3 border-zinc-400 mr-2'
          >
            <option value='All'>All</option>
            <option value='Approve'>Published</option>
            <option value='Pending'>Pending</option>
            <option value='Reject'>Rejected</option>
            <option value='Deactivated'>Deactivated</option>
          </select>
        </div>
      </div>
      <p className='pb-2 px-2 text-gray-600'>
        {filteredPosts.length} Results found
      </p>

      <div className='max-md:overflow-x-scroll'>
        <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 text-start py-2'>Title</th>
              <th className='px-4 text-start py-2'>Author Name</th>
              <th className='px-4 text-start py-2'>Status</th>
              <th className='px-4 text-start py-2'>Preview</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className='px-4 py-2'>{post.title}</td>
                <td className='px-4 py-2'>{post.author_email}</td>
                <td className='px-4 py-2 capitalize'>{post.status}</td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => handleReviewModal(post)}
                    className='bg-blue-500 text-white px-4 py-1 rounded-sm'
                  >
                    Preview
                  </button>
                </td>
                <td className='px-4 py-2 flex justify-end items-center'>
                  <button
                    onClick={() => handleApprovePost(post)}
                    className={`${
                      post.status === 'approve'
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-600'
                    } w-28 text-white px-4 py-1 rounded-sm`}
                    disabled={isApprovingId === post.id}
                  >
                    {isApprovingId === post.id ? (
                      <Loader size={24} className='animate-spin' />
                    ) : post.status === 'approved' ? (
                      'Approved'
                    ) : (
                      'Approve'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPost(post)
                      setIsRejectModalOpen(true)
                    }}
                    className={`bg-yellow-500 ${
                      post.status === 'approve' &&
                      'opacity-50 cursor-not-allowed'
                    } text-white px-4 py-1 ml-2 rounded-sm`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDeactive(post)}
                    className='bg-zinc-600 text-white px-4 py-1 ml-2 rounded-sm'
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className='bg-red-500 text-white px-4 py-1 ml-2 rounded-sm'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {isRejectModalOpen && (
            <RejectPostModal
              isOpen={true}
              onClose={() => setIsRejectModalOpen(false)}
              postId={selectedPost.id}
            />
          )}
          {isReviewModalOpen && (
            <ReviewPostModal
              isOpen={true}
              onClose={() => setIsReviewModalOpen(false)}
              post={selectedPost}
            />
          )}
          {isConfirmModalOpen && (
            <ConfirmModal
              isOpen={true}
              onClose={() => setIsConfirmModalOpen(false)}
              onConfirm={handleConfirmAction}
              action={confirmAction}
            />
          )}
        </table>
      </div>
      <Paggination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  )
}

export default PostManagement
