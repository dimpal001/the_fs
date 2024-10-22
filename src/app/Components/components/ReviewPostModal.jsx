import { Modal, ModalBody, ModalCloseButton } from '@/app/Components/Modal'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

const ReviewPostModal = ({ post, isOpen, onClose, id }) => {
  const [postData, setPostData] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  console.log(id)

  const handleFetchBlogPost = async () => {
    if (!id) return

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

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {}
  }

  useEffect(() => {
    handleFetchBlogPost()
    handleFetchCategories()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <Modal size={'4xl'} isOpen={isOpen}>
      <ModalCloseButton onClick={onClose} />
      <ModalBody>
        <div className='p-5'>
          <p className='text-4xl font-semibold py-3'>
            {id ? postData?.title : post?.title}
          </p>
          <div className='mb-3 flex gap-3'>
            {categories.length > 0 &&
              categories
                .filter((category) =>
                  postData.category_ids.includes(category.slug)
                )
                .map((category) => (
                  <span
                    className='text-sm capitalize px-3 py-1 text-white bg-gradient-to-br from-blue-600 to-pink-300 rounded-md'
                    key={category.slug}
                  >
                    {category.name}
                  </span>
                ))}
          </div>

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
