'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('selectedCategoryId')

      if (storedData) {
        if (!isNaN(storedData)) {
          return Number(storedData)
        }

        try {
          return JSON.parse(storedData)
        } catch (error) {
          console.error('Error parsing stored data:', error)
          return null
        }
      }
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('selectedCategoryId')
      if (storedData) {
        if (!isNaN(storedData)) {
          setSelectedCategoryId(Number(storedData))
        } else {
          try {
            setSelectedCategoryId(JSON.parse(storedData))
          } catch (error) {
            console.error('Error parsing stored data in useEffect:', error)
          }
        }
      }
    }
  }, [])

  return (
    <CategoryContext.Provider
      value={{ selectedCategoryId, setSelectedCategoryId }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategoryContext = () => {
  return useContext(CategoryContext)
}
