import { NotebookPen, SquarePen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserContext } from '../context/UserContext'
import { useEffect } from 'react'

const CreatePost = ({ setIsLoginModalOpen, setIsMenuOpen }) => {
  const router = useRouter()
  const { user } = useUserContext()

  const handleClick = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(false)
    }
    if (!user) {
      setIsLoginModalOpen(true)
    } else {
      router.push('/user/create-post')
    }
  }

  return (
    <div onClick={handleClick}>
      <div className='flex items-center gap-2 cursor-pointer group lg:p-2'>
        <p className='font-semibold group-hover:text-first'>Write Post</p>
        <SquarePen className='font-semibold group-hover:text-first' />
      </div>
    </div>
  )
}

export default CreatePost
