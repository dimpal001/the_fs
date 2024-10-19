import Button from '@/app/Components/Button'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from '@/app/Components/Modal'
import TextArea from '@/app/Components/TextArea'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useState } from 'react'

const RejectPostModal = ({ isOpen, onClose, postId }) => {
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprovePost = async () => {
    if (note === '') {
      enqueueSnackbar('Note is empty.', { variant: 'error' })
      return
    }
    try {
      setIsSubmitting(true)
      const response = await axios.patch(
        `/api/posts/${postId}`,
        {
          status: 'reject',
          reject_note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      enqueueSnackbar('Reject note has been sent.', { variant: 'success' })
      onClose()
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} size={'md'}>
      <ModalHeader>
        {' '}
        Reject note
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <TextArea
          placeholder={'Message ...'}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          loading={isSubmitting}
          label={'Submit'}
          onClick={handleApprovePost}
        />
      </ModalFooter>
    </Modal>
  )
}

export default RejectPostModal
