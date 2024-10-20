'use client'

import Image from 'next/image'
import UserImg from '../assets/user.svg'
import { useRouter } from 'next/navigation'
const ProfileCard = ({ name, id, date }) => {
  const route = useRouter()
  const handleClick = () => {
    route.push(`/profile/${id}`)
  }
  return (
    <div className='flex gap-3 max-md:gap-1 cursor-pointer items-center'>
      <Image
        onClick={handleClick}
        src={UserImg}
        className='w-14 max-md:w-10'
        alt='Profile image'
      />
      <div>
        <p
          onClick={handleClick}
          className='text-sm cursor-pointer font-semibold'
        >
          {name && name}
        </p>
        <p className='font-light text-xs text-neutral-500'>
          {date && new Date(date).toDateString()}
        </p>
      </div>
    </div>
  )
}

export default ProfileCard
