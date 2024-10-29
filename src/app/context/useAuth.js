// hooks/useAuth.js
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useUserContext } from './UserContext'
import axios from 'axios'

const useAuth = () => {
  const router = useRouter()
  const { setUser } = useUserContext()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check-auth', {
          withCredentials: true,
        })

        if (response.data.isAuthenticated) {
        } else {
          enqueueSnackbar('Session expired! Please log in again.', {
            variant: 'error',
          })
          setUser(null)
          localStorage.removeItem('user')
          router.push('/')
        }
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
        setUser(null)
        localStorage.removeItem('user')
        router.push('/')
      }
    }

    checkAuth()
  }, [router, setUser])
}

export default useAuth
