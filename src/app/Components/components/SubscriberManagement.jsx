import Button from '@/app/Components/Button'
import DeleteModal from '@/app/Components/DeleteModal'
import Input from '@/app/Components/Input'
import Loading from '@/app/Components/Loading'
import axios from 'axios'
import { X } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import Paggination from './Paggination'

const SubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState([])
  const [filterSubscribers, setFilterSubscribers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')

  const handleFetchSubscribers = async (page) => {
    try {
      const response = await axios.get('/api/subscribers', {
        params: { page: page },
      })
      setSubscribers(response.data.subscribers)
      setFilterSubscribers(response.data.subscribers)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (subscriber) => {
    setSelectedSubscriber(subscriber)
    setDeleteModalOpen(true)
  }

  const handleDeleteSubscriber = async () => {
    if (!selectedSubscriber.id) {
      enqueueSnackbar('subscriber ID is missing. Please try again.', {
        variant: 'error',
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.delete(
        `/api/subscribers/?id=${selectedSubscriber.id}`
      )
      enqueueSnackbar(response.data.message, { variant: 'success' })

      setSubscribers((previousData) =>
        previousData.filter(
          (subscriber) => subscriber.id !== selectedSubscriber.id
        )
      )
      setFilterSubscribers((previousData) =>
        previousData.filter(
          (subscriber) => subscriber.id !== selectedSubscriber.id
        )
      )

      setSelectedSubscriber({})
      setDeleteModalOpen(false)
    } catch (error) {
      console.error(error)
      enqueueSnackbar(
        error.response?.data?.message || 'Error deleting subscriber',
        { variant: 'error' }
      )
    } finally {
      setSubmitting(false)
      setSelectedSubscriber({})
    }
  }

  useEffect(() => {
    handleFetchSubscribers(currentPage)
  }, [])

  // Filter subscribers based on user input
  useEffect(() => {
    if (filter) {
      setFilterSubscribers(
        subscribers.filter((subscriber) =>
          subscriber?.email.toLowerCase().includes(filter.toLowerCase())
        )
      )
    } else {
      setFilterSubscribers(subscribers)
    }
  }, [filter, subscribers])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = parseInt(currentPage) + 1
      setCurrentPage(newPage)
      handleFetchSubscribers(newPage)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = parseInt(currentPage) - 1
      setCurrentPage(newPage)
      handleFetchSubscribers(newPage)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Subscribers</h2>
      {/* Filter Input */}
      <div className='w-72'>
        <Input
          placeholder='Filter subscribers...'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <p className='pb-2 px-2 pt-3 text-gray-600'>
          {filterSubscribers.length} Results found
        </p>
      </div>

      <div className=' w-full'>
        {/* subscriber Table  */}
        <div className='max-md:overflow-x-scroll'>
          <table className='w-full table-auto bg-white h-full shadow-md'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='px-4 py-2 text-start'>Subscriber</th>
                <th className='px-4 py-2 text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterSubscribers.length > 0 ? (
                filterSubscribers.map((subscriber, index) => (
                  <tr key={index} className='hover:bg-gray-100'>
                    <td className='px-4 py-2'>{subscriber.email}</td>
                    <td className='px-4 py-2 flex justify-end'>
                      <button
                        onClick={() => handleDelete(subscriber)}
                        className='bg-red-500 text-white px-4 py-1 ml-2 rounded-sm'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <div className='flex justify-center items-center h-full'>
                  <p className='p-10'>No subscriber found</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
        <Paggination
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />

        {/* Delete Modal  */}
        {deleteModalOpen && (
          <DeleteModal
            onOpen={true}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={handleDeleteSubscriber}
          />
        )}
      </div>
    </div>
  )
}

export default SubscriberManagement
