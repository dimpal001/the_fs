'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const BlogContext = createContext()

export const BlogProvider = ({ children }) => {
  const [selectedPostId, setSelectedPostId] = useState(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('selectedPostId')
      return storedData ? storedData : null
    }
    return null // Return null if localStorage is not available
  })

  useEffect(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('selectedPostId')
      if (storedData) {
        setSelectedPostId(storedData)
      }
    }
  }, [])

  return (
    <BlogContext.Provider value={{ selectedPostId, setSelectedPostId }}>
      {children}
    </BlogContext.Provider>
  )
}

export const useBlogContext = () => {
  return useContext(BlogContext)
}
