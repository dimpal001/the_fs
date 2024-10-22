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
          setUser(null)
          router.push('/')
          enqueueSnackbar('Session expired! Please log in again.', {
            variant: 'error',
          })
        }
      } catch (error) {
        setUser(null)
        router.push('/')
        enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
      }
    }

    checkAuth()
  }, [router, setUser])
}

export default useAuth
