import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import Input from '@/app/Components/Input'
import Loading from '@/app/Components/Loading'
import Paggination from './Paggination'

const HeroPostManagement = () => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [heroPosts, setHeroPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')

  const handleFetchPosts = async (page) => {
    setLoading(true)
    try {
      const response = await axios.get(
        '/api/posts',
        {
          params: { page: page, type: 'approve' },
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

  // Fetch both BlogPosts and HeroPosts from API
  const handleFetchHeroPosts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        '/api/posts/',
        {
          params: { isHeroPost: 1 },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setHeroPosts(response.data.posts)
    } catch (error) {
      enqueueSnackbar('Error fetching hero posts', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToHero = async (id, status) => {
    if (heroPosts.length === 4) {
      enqueueSnackbar('You are not allowed to add more posts here', {
        variant: 'error',
      })
      return
    }
    try {
      const response = await axios.patch('/api/posts/', {
        postId: id,
        isHeroPost: status,
      })
      enqueueSnackbar(response.data.message, { variant: 'success' })
      handleFetchHeroPosts()
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  // Filter posts based on search term and heroPostIds
  const handleFilterPosts = () => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
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
    handleFetchPosts(currentPage)
    handleFetchHeroPosts()
  }, [currentPage])

  useEffect(() => {
    handleFilterPosts()
  }, [searchTerm, posts])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Hero Posts</h2>

      {heroPosts.length > 0 && (
        <div className='max-md:overflow-x-scroll'>
          <p className='text-xl font-semibold py-2'>Hero Post</p>
          <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='px-4 text-start py-2'>Title</th>
                <th className='px-4 text-start py-2'>Author Name</th>
                <th className='px-4 text-start py-2'>Status</th>
                <th className='px-4 py-2 text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {heroPosts.map((post) => (
                <tr key={post.id}>
                  <td className='px-4 py-2'>{post.title}</td>
                  <td className='px-4 py-2'>{post.author_email}</td>
                  <td className='px-4 py-2 capitalize'>{post.status}</td>
                  <td className='px-4 py-2 flex justify-end items-center'>
                    <button
                      className={`bg-red-600 text-white px-4 py-1 ml-2 rounded-sm`}
                      onClick={() => handleAddToHero(post.id, 0)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='max-md:overflow-x-scroll'>
        <p className='text-xl font-semibold py-2'>All Posts</p>
        <div className='flex items-center gap-4'>
          <div>
            <Input
              type='text'
              placeholder='Search by title...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <p className='py-2 px-2 text-gray-600'>
          {filteredPosts.length} Results found
        </p>
        <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 text-start py-2'>Title</th>
              <th className='px-4 text-start py-2'>Author Name</th>
              <th className='px-4 text-start py-2'>Status</th>
              <th className='px-4 py-2 text-end'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className='px-4 py-2'>{post.title}</td>
                <td className='px-4 py-2'>{post.author_email}</td>
                <td className='px-4 py-2 capitalize'>{post.status}</td>
                <td className='px-4 py-2 flex justify-end items-center'>
                  <button
                    className={`bg-first text-white px-4 py-1 ml-2 rounded-sm`}
                    onClick={() => handleAddToHero(post.id, 1)}
                  >
                    Add to Hero Post
                  </button>
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

export default HeroPostManagement
