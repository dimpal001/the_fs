'use client'

import Input from '@/app/Components/Input'
import { useUserContext } from '@/app/context/UserContext'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import UserProfileModal from './UserProfileModal'
import Loading from '@/app/Components/Loading'
import DeleteModal from '@/app/Components/DeleteModal'
import Paggination from './Paggination'
import { Eye } from 'lucide-react'
import { Modal, ModalBody, ModalCloseButton, ModalHeader } from '../Modal'

const ContactManagement = () => {
  const [messages, setMessages] = useState([])
  const { user } = useUserContext()

  // State for filters
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState({})
  const [selectedId, setSelectedId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState('')

  const handleFetchMessages = async (page) => {
    try {
      const response = await axios.get('/api/admin/contact', {
        params: { page: page },
        // withCredentials: true,
      })
      setMessages(response.data.messages)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
      setIsLoading(false)
    } catch (error) {
      enqueueSnackbar('Error fetching users', { variant: 'error' })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchMessages(currentPage)
  }, [])

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleMessageDelete = async () => {
    try {
      const response = await axios.delete('/api/admin/contact', {
        params: { id: selectedId },
      })
      if (response.status === 200) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== selectedId)
        )
        enqueueSnackbar(response.data.message, { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setSelectedId('')
      setDeleteModalOpen(false)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = parseInt(currentPage) + 1
      setCurrentPage(newPage)
      handleFetchUsers(newPage)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = parseInt(currentPage) - 1
      setCurrentPage(newPage)
      handleFetchUsers(newPage)
    }
  }

  if (isLoading) {
    return <Loading />
  }
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Contact Form Messages</h2>

      {/* Filters */}
      <div className='mb-4 flex gap-5 items-center'>
        <div>
          <Input
            type='text'
            placeholder='Search by email or name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <p className='pb-2 px-2 text-gray-600'>
        {filteredMessages.length} Results found
      </p>

      <div className='max-md:overflow-x-scroll'>
        <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 py-2 text-start'>Email</th>
              <th className='px-4 py-2 text-start'>Name</th>
              <th className='px-4 py-2 text-start'>Created at</th>
              <th className='px-4 py-2 text-start'>Message</th>
              <th className='px-4 py-2 text-end'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((message) => (
              <tr key={message.id} className='hover:bg-gray-100'>
                <td className='px-4 py-2'>{message.email}</td>
                <td className='px-4 py-2 hover:text-first hover:underline cursor-pointer'>
                  {message.name}
                </td>
                <td className='px-4 py-2'>
                  {new Date(message.submitted_at).toLocaleDateString()}
                </td>
                <td className='px-4 py-2 capitalize'>
                  <Eye
                    onClick={() => {
                      setShowMessage(true)
                      setSelectedMessage(message)
                    }}
                    size={25}
                    className='text-neutral-500 cursor-pointer'
                  />
                </td>
                <td className='px-4 py-2 text-end'>
                  <button
                    title='Delete'
                    onClick={() => {
                      setSelectedId(message.id)
                      setDeleteModalOpen(true)
                    }}
                    className='bg-red-600 text-white px-4 py-1 ml-2 rounded-sm'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {isUserModalOpen && (
              <UserProfileModal
                isOpen={true}
                onClose={() => setIsUserModalOpen(false)}
                id={selectedId}
              />
            )}
            <DeleteModal
              onOpen={isDeleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onDelete={handleMessageDelete}
            />
          </tbody>
        </table>
      </div>
      <Paggination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
      {showMessage && (
        <Modal size={'md'} isOpen={true}>
          <ModalHeader>
            Message by {selectedMessage?.name}
            <ModalCloseButton onClick={() => setShowMessage(false)} />
          </ModalHeader>
          <ModalBody>{selectedMessage?.message}</ModalBody>
        </Modal>
      )}
    </div>
  )
}

export default ContactManagement
