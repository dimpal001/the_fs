import CreatePost from '@/app/Components/CreatePost'
import { useUserContext } from '@/app/context/UserContext'
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Header = ({ showDrawer, setShowDrawer }) => {
  const { setUser } = useUserContext()
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }
  return (
    <header className='bg-white shadow p-4 flex justify-between items-center'>
      <div>
        {showDrawer ? (
          <SquareChevronLeft
            className='cursor-pointer'
            onClick={() => setShowDrawer(false)}
          />
        ) : (
          <SquareChevronRight
            className='cursor-pointer'
            onClick={() => setShowDrawer(true)}
          />
        )}
      </div>
      <div className='flex items-center gap-5'>
        <Link className='hover:text-first' href={'/'}>
          Main Website
        </Link>
        <div className='max-md:hidden'>
          <CreatePost />
        </div>
        <button
          title='Logout'
          onClick={handleLogout}
          className='px-4 py-2 bg-red-500 text-white rounded-sm'
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
