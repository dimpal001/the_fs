import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicMenu } from '../DynamicMenu'
import Input from '@/app/Components/Input'
import Loading from '@/app/Components/Loading'
import Paggination from './Paggination'

const PostManagement = () => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')
  const [totalPosts, setTotalPosts] = useState(null)
  const [categories, setCategories] = useState(null)
  const router = useRouter()

  // Unified function to fetch posts with all filters
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

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {
      enqueueSnackbar('Failed to fetch categories', { variant: 'error' })
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
    handleFetchCategories()
  }, [])

  useEffect(() => {
    handleFetchPosts(currentPage)
  }, [searchTerm, filterStatus, filterCategory])

  return (
    <div>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold mb-4'>Manage Posts</h2>
        {totalPosts && <p className='text-sm'>Total Posts: {totalPosts}</p>}
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
                      </button>
                    }
                  >
                    <ActionButton
                      actionType='edit'
                      postId={post.id}
                      onClick={() => router.push(`/edit-post/${post.id}`)}
                    />
                    <ActionButton
                      actionType='delete'
                      postId={post.id}
                      onClick={() => handleDelete(post.id)}
                    />
                  </DynamicMenu>
                </td>
              </tr>
            ))}
          </tbody>
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
