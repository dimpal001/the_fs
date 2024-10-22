import React from 'react'
import { Modal, ModalBody, ModalCloseButton } from './Modal'
import Image from 'next/image'

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Modal size={'full'} isOpen={isOpen}>
      <ModalBody>
        <ModalCloseButton onClick={() => onClose()} />
        <div className='w-full h-full flex justify-center items-center'>
          <div className='max-md:w-full lg:h-full'>
            <Image
              className=''
              src={imageUrl ? imageUrl : 'https://picsum.photos/803/647'}
              width={0}
              height={0}
              sizes='100vw'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              alt={'Image'}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ImageModal
