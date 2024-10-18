import Loading from '@/app/Components/Loading'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from '@/app/Components/Modal'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

const ViewSingleReplyModal = ({ isOpen, onClose, data }) => {
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState({})

  const handleFetchReply = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/replies', {
        params: { id: data },
      })
      setReply(response.data[0])
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchReply()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <Modal size={'md'} isOpen={isOpen}>
      <ModalHeader>
        Reply by {reply?.author_name ? reply?.author_name : reply.name}
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <div className='text-sm flex justify-between items-center text-neutral-600'>
          <p>{new Date(reply?.created_at).toDateString()}</p>
          <p
            className={`${
              reply?.is_approved ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {reply?.is_approved ? 'Verified' : 'Not verified'}
          </p>
        </div>
        <p>{reply?.content}</p>
        {reply?.link && reply.link.startsWith('https://') ? (
          <a
            href={reply.link}
            target='_blank' // Open link in a new tab
            rel='noopener noreferrer' // Security feature
            className='text-blue-600 underline'
          >
            {reply.link}
          </a>
        ) : (
          <p>{reply?.link}</p>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ViewSingleReplyModal
