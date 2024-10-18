import Button from './Button'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from './Modal'

const DeleteModal = ({ onOpen, onClose, onDelete }) => {
  return (
    <Modal size={'md'} isOpen={onOpen}>
      <ModalHeader>
        {' '}
        Delete ?
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>This function cannot be undone</ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant={'second'} label={'Cancel'} />
        <Button onClick={onDelete} variant={'error'} label={'Delete'} />
      </ModalFooter>
    </Modal>
  )
}

export default DeleteModal
