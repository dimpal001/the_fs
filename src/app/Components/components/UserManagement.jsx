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

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const { user } = useUserContext()

  // State for filters
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleFetchUsers = async (page = 1) => {
    setIsLoading(true)
    const params = {
      page,
      searchQuery: searchTerm,
      activeUser: filterStatus === 'all' ? '' : filterStatus,
    }
    try {
      const response = await axios.get('/api/admin/users', { params })

      setUsers(response.data.users)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      enqueueSnackbar('Error fetching users', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchUsers()
  }, [])

  useEffect(() => {
    handleFetchUsers(currentPage)
  }, [searchTerm, filterStatus, currentPage])

  const handleDeactivate = async (user_data) => {
    if (user.id === user_data.id) {
      enqueueSnackbar('You cannot deactivate yourself', { variant: 'error' })
      return
    }
    try {
      await axios.patch(`/api/admin/users/${user_data.id}`, {
        is_active: false,
      })
      enqueueSnackbar('User has been deactivated', { variant: 'success' })
      handleFetchUsers()
    } catch (error) {
      enqueueSnackbar('Error updating user', { variant: 'error' })
    }
  }

  const handleActivate = async (user_data) => {
    try {
      await axios.patch(`/api/admin/users/${user_data.id}`, {
        is_active: true,
      })
      enqueueSnackbar('User has been activated', { variant: 'success' })
      handleFetchUsers()
    } catch (error) {
      enqueueSnackbar('Error updating user', { variant: 'error' })
    }
  }

  const handleUserDelete = async () => {
    try {
      if (selectedId === user.id) {
        enqueueSnackbar('You cannot delete yourself!', { variant: 'error' })
        setDeleteModalOpen(false)
        setSelectedId('')
        return
      }
      const response = await axios.delete('/api/admin/users', {
        params: { id: selectedId },
      })

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedId)
        )
        enqueueSnackbar(response.data.message, { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar('Error deleting user', { variant: 'error' })
    } finally {
      setSelectedId('')
      setDeleteModalOpen(false)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Users</h2>

      {/* Filters */}
      <div className='mb-4 flex gap-5 items-center'>
        <Input
          type='text'
          placeholder='Search by email or name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className='border rounded-sm p-3'
        >
          <option value='all'>All Users</option>
          <option value='1'>Active Users</option>
          <option value='0'>Inactive Users</option>
        </select>
      </div>

      <div className='max-md:overflow-x-scroll'>
        <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 py-2 text-start'>Name</th>
              <th className='px-4 py-2 text-start'>Joined</th>
              <th className='px-4 py-2 text-start'>Role</th>
              <th className='px-4 py-2 text-start'>Posts</th>
              <th className='px-4 py-2 text-end'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((fetchUser) => (
              <tr
                key={fetchUser.id}
                className={`hover:bg-gray-100 ${
                  user.id === fetchUser.id ? 'bg-teal-50' : ''
                }`}
              >
                <td
                  className='px-4 py-2 hover:underline cursor-pointer'
                  onClick={() => {
                    setIsUserModalOpen(true)
                    setSelectedId(fetchUser.id)
                  }}
                >
                  {fetchUser.name}
                </td>
                <td className='px-4 py-2'>
                  {new Date(fetchUser.created_at).toLocaleDateString()}
                </td>
                <td className='px-4 py-2 capitalize'>{fetchUser.role}</td>
                <td className='px-4 py-2'>{fetchUser.totalPosts}</td>
                <td className='px-4 py-2 text-end'>
                  {fetchUser.is_active ? (
                    <button
                      className='bg-gray-600 text-white px-4 py-1 rounded-sm'
                      onClick={() => handleDeactivate(fetchUser)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className='bg-green-600 text-white px-4 py-1 ml-2 rounded-sm'
                      onClick={() => handleActivate(fetchUser)}
                    >
                      Activate
                    </button>
                  )}
                  <button
                    className='bg-red-600 text-white px-4 py-1 ml-2 rounded-sm'
                    onClick={() => {
                      setSelectedId(fetchUser.id)
                      setDeleteModalOpen(true)
                    }}
                  >
                    Delete
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

      {isUserModalOpen && (
        <UserProfileModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          id={selectedId}
        />
      )}
      <DeleteModal
        onOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleUserDelete}
      />
    </div>
  )
}

export default UserManagement
