import React from 'react'
import {
  FacebookIcon,
  FlipboardIcon,
  InstagramIcon,
  PinterestIcon,
  TwitterIcons,
} from './SocialIcons'
import Link from 'next/link'

const SocialDiadies = () => {
  return (
    <div className='w-full bg-green-100 py-16 rounded-2xl'>
      <p className='lg:text-5xl text-4xl lg:pb-3 uppercase font-serif tracking-wider lg:tracking-widest font-extrabold text-center'>
        follow us
      </p>
      <p className='text-center uppercase lg:tracking-widest text-base font-serif lg:text-xl'>
        On our social networks
      </p>
      <div className='flex justify-center w-full'>
        <Link href={'https://www.instagram.com/thefashionsalad_blog/'}>
          <InstagramIcon />
        </Link>
        <Link href={'https://www.facebook.com/profile.php?id=61567652667493'}>
          <FacebookIcon />
        </Link>
        <Link href={'https://x.com/Fashion_Salad'}>
          <TwitterIcons />
        </Link>
        <Link href={'https://in.pinterest.com/thefashionsalad/'}>
          <PinterestIcon />
        </Link>
        <Link href={'https://www.flipboard.com'}>
          <FlipboardIcon />
        </Link>
      </div>
    </div>
  )
}

export default SocialDiadies
