import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from '@/app/Components/Modal'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import Button from '@/app/Components/Button'
import { useRouter } from 'next/navigation'

const UserProfileModal = ({ isOpen, onClose, id }) => {
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/users/', {
        params: { id: id },
      })
      setUserDetails(response.data)
    } catch (error) {
      enqueueSnackbar('Error fetching user details', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUserDetails()
    }
  }, [id])

  return (
    <Modal size={'sm'} isOpen={isOpen}>
      <ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <h2 className='text-lg capitalize font-bold'>
          {userDetails?.role} Profile
        </h2>
      </ModalHeader>
      <ModalBody>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <p>Loading...</p>
          </div>
        ) : (
          userDetails && (
            <div className='px-4'>
              <div className='mb-4'>
                {/* <h3 className='text-xl font-semibold'>Details</h3> */}
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>Name:</span>
                    <span className='font-semibold'>
                      {userDetails.name ? userDetails.name : 'Nan'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium'>Email:</span>
                    <span className='font-semibold'>{userDetails.email}</span>
                  </div>
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  onClick={() => router.push(`/profile/${userDetails?.id}`)}
                  label={'Visit Profile'}
                />
                <Button label={'Close'} onClick={onClose} variant={'error'} />
              </div>
            </div>
          )
        )}
      </ModalBody>
    </Modal>
  )
}

export default UserProfileModal
