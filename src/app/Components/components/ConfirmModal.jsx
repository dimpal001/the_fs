import Button from '@/app/Components/Button'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from '@/app/Components/Modal'
import React from 'react'

const ConfirmModal = ({ isOpen, onClose, action, button, onConfirm }) => {
  return (
    <Modal size={'sm'} isOpen={isOpen}>
      <ModalHeader>
        {' '}
        Confirmation
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <p>This function cannot be undone.</p>
      </ModalBody>
      <ModalFooter>
        {button && button}
        {action && (
          <button
            onClick={onConfirm}
            className='bg-red-500 capitalize text-white px-4 py-1 rounded-sm'
          >
            {action}
          </button>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal
