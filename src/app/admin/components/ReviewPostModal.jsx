import { Modal, ModalBody, ModalCloseButton } from '@/app/Components/Modal'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

const ReviewPostModal = ({ post, isOpen, onClose, id }) => {
  const [postData, setPostData] = useState(null)
  const [loading, setLoading] = useState(false) // Added loading state

  const handleFetchBlogPost = async () => {
    if (!id) return // Check if id is provided

    try {
      setLoading(true)
      const response = await axios.get(`/api/posts/`, {
        params: { id: id },
      })
      setPostData(response.data[0])
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch post', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchBlogPost()
  }, [id]) // Added id to dependencies

  if (loading) {
    return <p>Loading...</p> // Add loading indicator if needed
  }

  return (
    <Modal size={'4xl'} isOpen={isOpen}>
      <ModalCloseButton onClick={onClose} />
      <ModalBody>
        <div className='p-5'>
          <p className='text-4xl font-semibold py-3'>
            {id ? postData?.title : post?.title}
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: id ? postData?.content : post?.content,
            }}
          />
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ReviewPostModal
