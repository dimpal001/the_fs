'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null // Return null if localStorage is not available
  })

  useEffect(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Optionally clear invalid data from localStorage
          localStorage.removeItem('user')
        }
      }
    }
  }, [])

  const logout = () => {
    setUser(null)
    // Clear user data from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  return useContext(UserContext)
}
