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
  const [totalPages, setTotalPages] = useState('')

  const handleFetchUsers = async (page) => {
    try {
      const response = await axios.get(
        '/api/admin/users',
        {
          params: { page: page },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setUsers(response.data.users)
      setCurrentPage(response.data.current_page)
      setTotalPages(response.data.total_pages)
      setIsLoading(false)
    } catch (error) {
      enqueueSnackbar('Error fetching users', { variant: 'error' })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchUsers(currentPage)
  }, [])

  const handleDeactivate = async (user_data) => {
    if (user.id === user_data.id) {
      enqueueSnackbar('You cannot deactivate yourself', { variant: 'error' })
      return
    }
    try {
      await axios.patch(`/api/admin/users/${user_data.id}`, {
        is_active: false,
      })
      enqueueSnackbar('User has been updated', { variant: 'success' })
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
      enqueueSnackbar('User has been updated', { variant: 'success' })
      handleFetchUsers()
    } catch (error) {
      enqueueSnackbar('Error updating user', { variant: 'error' })
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active)
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

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
      <h2 className='text-2xl font-bold mb-4'>Manage Users</h2>

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

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className='border rounded-sm p-3'
        >
          <option value='all'>All Users</option>
          <option value='active'>Active Users</option>
          <option value='inactive'>Inactive Users</option>
        </select>
      </div>

      <p className='pb-2 px-2 text-gray-600'>
        {filteredUsers.length} Results found
      </p>

      <div className='max-md:overflow-x-scroll'>
        <table className='min-w-full table-auto bg-white shadow-md rounded-sm'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 py-2 text-start'>Email</th>
              <th className='px-4 py-2 text-start'>Name</th>
              <th className='px-4 py-2 text-start'>Joined</th>
              <th className='px-4 py-2 text-start'>Role</th>
              <th className='px-4 py-2 text-start'></th>
              <th className='px-4 py-2 text-start'></th>
              <th className='px-4 py-2 text-end'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((fetchUser) => (
              <tr
                key={fetchUser.id}
                className={`hover:bg-gray-100 ${
                  user?.id === fetchUser?.id && 'bg-teal-50 '
                }`}
              >
                <td
                  onClick={() => {
                    setIsUserModalOpen(true)
                    setSelectedId(fetchUser.id)
                  }}
                  className='px-4 py-2 hover:text-first hover:underline cursor-pointer'
                >
                  {fetchUser.email}
                </td>
                <td
                  onClick={() => {
                    setIsUserModalOpen(true)
                    setSelectedId(fetchUser.id)
                  }}
                  className='px-4 py-2 hover:text-first hover:underline cursor-pointer'
                >
                  {fetchUser.name}
                </td>
                <td className='px-4 py-2'>
                  {new Date(fetchUser.created_at).toLocaleDateString()}
                </td>
                <td className='px-4 py-2 capitalize'>{fetchUser.role}</td>
                <td className='px-4 py-2 text-sm text-zinc-400 capitalize'>
                  {!fetchUser.is_active && 'This account is deactivated'}
                </td>
                <td className='relative'>
                  {user?.id === fetchUser?.id && (
                    <span className='text-xs px-3 rounded-2xl p-1 bg-blue-700 text-white'>
                      You
                    </span>
                  )}
                </td>

                <td className='px-4 py-2 text-end'>
                  {fetchUser.is_active ? (
                    <button
                      title='Deactivate'
                      onClick={() => handleDeactivate(fetchUser)}
                      className='bg-gray-600 text-white px-4 py-1 rounded-sm'
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      title='Activate'
                      onClick={() => handleActivate(fetchUser)}
                      className='bg-green-600 text-white px-4 py-1 ml-2 rounded-sm'
                    >
                      Activate
                    </button>
                  )}
                  <button
                    title='Delete'
                    onClick={() => {
                      setSelectedId(fetchUser.id)
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
              onDelete={handleUserDelete}
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
    </div>
  )
}

export default UserManagement
