import axios from 'axios'
import { ChevronDown } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import RejectPostModal from './RejectPostModal'
import ReviewPostModal from './ReviewPostModal'
import ConfirmModal from './ConfirmModal'
import Input from '@/app/Components/Input'
import Loading from '@/app/Components/Loading'
import Paggination from './Paggination'
import { useRouter } from 'next/navigation'
import { DynamicMenu } from '../DynamicMenu'

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
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')
  const [totalPosts, setTotalPosts] = useState(null)
  const [categories, setCategories] = useState(null)
  const router = useRouter()

  const handleFetchPosts = async (page = 1) => {
    setLoading(true)

    // Build the query params
    const params = {
      page: page,
      searchQuery: searchTerm,
      status: filterStatus === 'All' ? '' : filterStatus.toLowerCase(),
      categorySlug: filterCategory === 'All' ? '' : filterCategory,
    }

    try {
      const response = await axios.get('/api/posts', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setPosts(response.data.posts)
      setFilteredPosts(response.data.posts)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
      setTotalPosts(response.data.total_posts)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Filter posts based on status, category, and search term
  const handleFilterPosts = () => {
    let filtered = posts

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(
        (post) => post.status === filterStatus.toLowerCase()
      )
    }

    // Filter by category
    if (filterCategory !== 'All') {
      const categoryId = categories.find(
        (cat) => cat.slug === filterCategory
      )?.slug

      console.log(categoryId)

      if (categoryId) {
        filtered = filtered.filter((post) =>
          post.category_ids.includes(categoryId)
        )
      }
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

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {}
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
    handleFetchCategories()
  }, [])

  // useEffect(() => {
  //   handleFilterPosts(currentPage)
  // }, [filterStatus, filterCategory, searchTerm, posts])

  useEffect(() => {
    handleFetchPosts(currentPage)
  }, [searchTerm, filterStatus, filterCategory])

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
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold mb-4'>Manage Posts</h2>
        {totalPosts && <p className='text-sm'>Total Posts : {totalPosts}</p>}
      </div>

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
            {/* <option value='Reject'>Rejected</option> */}
            <option value='Deactivated'>Deactivated</option>
          </select>
          {categories && categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='border rounded-sm p-3 border-zinc-400 mr-2'
            >
              <option value='All'>All</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <p className='pb-2 px-2 text-gray-600'>
        {filteredPosts.length} Results found
      </p>

      <div className='max-md:overflow-x-scroll'>
        <table className='min-w-full text-sm table-auto bg-white shadow-md rounded-sm'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 text-start py-2'>Title</th>
              <th className='px-4 text-start py-2'>Author Name</th>
              <th className='px-4 text-start py-2'>Status</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td
                  onClick={() => handleReviewModal(post)}
                  className='px-4 hover:text-first cursor-pointer py-2'
                >
                  {post.title}
                </td>
                <td className='px-4 py-2'>{post.author_name}</td>
                <td
                  className={`px-4 ${
                    post.status === 'approve' && 'text-green-500'
                  } ${
                    post.status === 'deactivated' && 'text-red-500'
                  } py-2 capitalize`}
                >
                  {post.status}
                </td>
                <td className='px-4 py-2 flex justify-end items-center'>
                  <DynamicMenu
                    button={
                      <button className='flex items-center gap-2 p-1 px-4 border border-dotted'>
                        Action
                        <ChevronDown />
                      </button>
                    }
                  >
                    <div className='w-full'>
                      <ActionButton
                        onClick={() =>
                          router.push(`/user/edit-post/${post?.id}`)
                        }
                        title={'Edit'}
                      />
                      <ActionButton
                        isDisabled={post.status !== 'approve' ? false : true}
                        onClick={() => handleApprovePost(post)}
                        title={'Approve'}
                      />
                      <ActionButton
                        isDisabled={post.status === 'deactivated' && true}
                        onClick={() => handleDeactive(post)}
                        title={'Deactivate'}
                      />
                      <ActionButton
                        onClick={() => handleDelete(post)}
                        title={'Delete'}
                        isNormal={false}
                      />
                    </div>
                  </DynamicMenu>
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
              // post={selectedPost}
              id={selectedPost.id}
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

const ActionButton = ({ onClick, title, isNormal = true, isDisabled }) => {
  return (
    <p
      className={`p-2 font-semibold px-3 ${
        isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
      } border border-transparent hover:border-gray-600 ${
        isNormal
          ? 'text-black hover:text-blue-600'
          : 'text-red-500 hover:text-red-700'
      } hover:border-dotted`}
      onClick={isDisabled ? null : onClick}
    >
      {title}
    </p>
  )
}

export default PostManagement
