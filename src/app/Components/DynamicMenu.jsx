import React, { useState, useEffect, useRef } from 'react'
import { useUserContext } from '../context/UserContext'

export const DynamicMenu = ({ button, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const { user } = useUserContext()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
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
  }, [isOpen])

  useEffect(() => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: buttonRect.bottom,
        left: buttonRect.left,
      })
    }
  }, [isOpen])

  const handleItemClick = (callback) => {
    if (callback) {
      callback()
    }
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <div
        ref={buttonRef}
        className={`cursor-pointer ${!user && 'hidden'}`}
        onClick={toggleMenu}
      >
        {React.isValidElement(button) ? button : null}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className='absolute z-30 top-7 w-32 right-7 border bg-white shadow-md rounded-md p-4'
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => handleItemClick(child.props.onClick),
              })
            }
            return null // Ignore invalid children
          })}
        </div>
      )}
    </div>
  )
}
