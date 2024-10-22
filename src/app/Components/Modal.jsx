import { useEffect, useRef, useState } from 'react'

// T CSS
export const Modal = ({ isOpen, children, size }) => {
  const [showModal, setShowModal] = useState(isOpen)

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  return (
    <>
      {showModal ? (
        <div
          className={`fixed inset-0 top-0 bottom-0 z-50 w-screen h-screen flex items-center justify-center`}
        >
          <div className='fixed inset-0 z-40 bg-black opacity-50'></div>
          <div
            className={`relative z-50 animate__animated animate__fadeInUp animate__faster
              ${
                size === 'sm' &&
                'w-[400px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === 'lg' &&
                'w-[450px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === 'md' &&
                'w-[500px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === 'xl' &&
                'w-[600px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === '2xl' &&
                'w-[700px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === '3xl' &&
                'w-[800px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === '4xl' &&
                'w-[900px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === '5xl' &&
                'w-[1000px] max-sm:w-[95%] overflow-scroll max-sm:m-auto'
              }
              ${
                size === 'full' &&
                'w-full h-full flex items-center max-md:pb-14'
              }
               bg-white rounded-2xl p-10`}
          >
            {children}
          </div>
        </div>
      ) : null}
    </>
  )
}

// T CSS
export const ModalContent = ({ children }) => {
  return <div>{children}</div>
}

// T CSS
export const ModalHeader = ({ children }) => {
  return (
    <div className='text-2xl border-b pb-3 font-normal text-first text-primary mb-4'>
      {children}
    </div>
  )
}

// T CSS
export const ModalCloseButton = ({ onClick }) => {
  return (
    <button
      title='Close'
      className='absolute top-0 right-0 m-2 p-2 text-gray-500 hover:text-gray-700'
      onClick={onClick}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 text-primary w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    </button>
  )
}

// T CSS
export const ModalBody = ({ children }) => {
  return (
    <div className='text-gray-700 h-full max-h-[450px] md:max-h-[500px] overflow-scroll'>
      {children}
    </div>
  )
}

// T CSS
export const ModalFooter = ({ children }) => {
  return <div className='flex justify-end gap-2 mt-5'>{children}</div>
}

export const Menu = ({ children, isOpen, onClose }) => {
  const menuRef = useRef(null)

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div
      ref={menuRef}
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ display: isOpen ? 'block' : 'none' }} // Prevents clicks when not open
    >
      <div
        className={`absolute top-0 right-0 bg-white p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: '250px',
          height: '100%',
          boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
        }}
      >
        <button
          title='Close'
          onClick={onClose}
          className='absolute top-2 right-2'
        >
          Close
        </button>
        {children}
      </div>
    </div>
  )
}
