'use client'

import Image from 'next/image'
import UserImg from '../assets/user.svg'
import { useRouter } from 'next/navigation'
const ProfileCard = ({ name, id, date, author_image }) => {
  const route = useRouter()
  const handleClick = () => {
    route.push(`/profile/${id}`)
  }
  return (
    <div className='flex gap-3 max-md:gap-1 cursor-pointer items-center'>
      <div onClick={handleClick} className='rounded-full w-[40px] h-[40px]'>
        <Image
          className='rounded-full'
          src={
            author_image
              ? `https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/profile-pictures/${author_image}`
              : UserImg
          }
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          alt={name}
        />
      </div>
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
