import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import Input from '@/app/Components/Input'
import ReviewPostModal from './ReviewPostModal'
import Loading from '@/app/Components/Loading'
import Paggination from './Paggination'
import { Eye } from 'lucide-react'
import ViewSingleReplyModal from './ViewSingleReplyModal'

const ReplyManagement = () => {
  const [replies, setReplies] = useState([])
  const [filteredReplies, setFilteredReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyToDelete, setReplyToDelete] = useState(null)
  const [selectedId, setSelectedId] = useState('')
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')
  const [isViewReplyModalOpen, setIsViewReplyModalOpen] = useState(false)

  const handleFetchReplies = async (page) => {
    try {
      const response = await axios.get(
        '/api/replies/',
        {
          params: { page: page },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setReplies(response.data.replies)
      setFilteredReplies(response.data.replies)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReply = async (reply) => {
    if (reply.status === 'approved') {
      return null
    }
    if (reply.id) {
      try {
        const response = await axios.patch(
          '/api/replies/',
          {
            id: reply.id,
            status: 'approved',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        enqueueSnackbar(response.data.message, { variant: 'success' })
        setReplies((prevReplies) =>
          prevReplies.map((item) =>
            item.id === reply.id ? { ...item, status: 'approved' } : item
          )
        )
        filterReplies(filterStatus)
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' })
      }
    }
  }

  const handleDeleteReply = async () => {
    if (replyToDelete && replyToDelete.id) {
      try {
        const response = await axios.delete(
          `/api/replies/`,
          {
            params: { id: replyToDelete.id },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        enqueueSnackbar(response.data.message, { variant: 'success' })
        setReplies((prevReplies) =>
          prevReplies.filter((item) => item.id !== replyToDelete.id)
        )
        setFilteredReplies((prevReplies) =>
          prevReplies.filter((item) => item.id !== replyToDelete.id)
        )
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' })
      } finally {
        setIsModalOpen(false)
        setReplyToDelete(null)
      }
    }
  }

  const handleFilterChange = (e) => {
    const status = e.target.value
    setFilterStatus(status)
    filterReplies(status)
  }

  const filterReplies = (is_approved) => {
    let filtered = replies
    if (is_approved !== 'all') {
      filtered = replies.filter((reply) => reply.is_approved === is_approved)
    }
    setFilteredReplies(filtered)
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    const searched = replies.filter((reply) =>
      reply.content.toLowerCase().includes(term)
    )
    setFilteredReplies(searched)
  }

  const openDeleteModal = (reply) => {
    setReplyToDelete(reply)
    setIsModalOpen(true)
  }

  const handleReviewPost = (id) => {
    setSelectedId(id)
    setIsReviewModalOpen(true)
  }

  useEffect(() => {
    handleFetchReplies()
  }, [])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = parseInt(currentPage) + 1
      setCurrentPage(newPage)
      handleFetchReplies(newPage)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = parseInt(currentPage) - 1
      setCurrentPage(newPage)
      handleFetchReplies(newPage)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Replies</h2>

      {/* Search and Filter Section */}
      <div className='flex mb-4 space-x-4'>
        <div>
          <Input
            placeholder='Search replies...'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className='border border-gray-300 bg-white px-4 py-2 rounded-sm focus:outline-none'
        >
          <option value='all'>All</option>
          <option value='approved'>Approved</option>
          <option value='pending'>Pending</option>
        </select>
      </div>

      <p className='pb-2 px-2 text-gray-600'>
        {filteredReplies.length} Results found
      </p>

      {/* Replies Table */}
      <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='px-4 py-2 text-start'>Reply</th>
            <th className='px-4 py-2 text-start'>Reply by</th>
            <th className='px-4 py-2 text-start'>Replied on</th>
            <th className='px-4 py-2 text-start'>Status</th>
            <th className='px-4 py-2 text-end'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReplies.map((reply) => (
            <tr key={reply.id} className='border-b'>
              <td className='px-4 py-2 w-[550px] flex gap-3 items-center'>
                {reply.content}{' '}
                <Eye
                  onClick={() => {
                    setSelectedId(reply.id)
                    setIsViewReplyModalOpen(true)
                  }}
                  className='cursor-pointer'
                />
              </td>
              <td className='px-4 py-2'>
                {reply.author_name ? reply?.author_name : reply?.name}
              </td>
              <td className='px-4 py-2 text-sm'>
                {new Date(reply.created_at).toDateString()}
              </td>
              <td
                className={`px-4 py-2 capitalize text-sm ${
                  reply?.is_approved ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {reply.is_approved ? 'Verified' : 'Not verified'}
              </td>
              <td className='px-4 py-2 text-end'>
                <button
                  onClick={() => handleReviewPost(reply.blog_post_id)}
                  className='bg-blue-500 text-white px-4 py-1 mr-2 rounded-sm'
                >
                  Post
                </button>
                <button
                  onClick={() => handleApproveReply(reply)}
                  className={`${
                    reply.status === 'approved' &&
                    'opacity-50 cursor-not-allowed'
                  } bg-green-500 text-white px-4 py-1 rounded-sm`}
                >
                  Approve
                </button>
                <button
                  onClick={() => openDeleteModal(reply)}
                  className='bg-red-500 text-white px-4 py-1 ml-2 rounded-sm'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paggination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />

      {isModalOpen && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          button={
            <button
              onClick={handleDeleteReply}
              className='bg-red-500 text-white px-4 py-1 rounded-sm'
            >
              Delete
            </button>
          }
        />
      )}

      {isReviewModalOpen && (
        <ReviewPostModal
          isOpen={true}
          onClose={() => setIsReviewModalOpen(false)}
          id={selectedId}
        />
      )}

      {isViewReplyModalOpen && (
        <ViewSingleReplyModal
          isOpen={true}
          onClose={() => setIsViewReplyModalOpen(false)}
          data={selectedId}
        />
      )}
    </div>
  )
}

export default ReplyManagement
