import { Facebook, Instagram, Search, Twitter, Youtube } from 'lucide-react'
import React from 'react'

const Header2 = () => {
  return (
    <div className='p-10 py-14'>
      <div className='flex flex-col items-center justify-center'>
        <p className='text-xl font-light tracking-[7px]'>
          EVERYTHING IS PERSONAL. INCLUDING THIS BLOG.
        </p>
        <p className='text-[120px] font-semibold font-serif'>
          The Fashion Salad
        </p>
      </div>

      <div className='flex justify-evenly h-14 mt-10'>
        <div className='text-zinc-800 w-full h-full border-r border-t flex justify-center items-center font-thin border-b p-4 border-zinc-700'></div>
        <div className='text-zinc-800 w-full h-full border-r border-t flex justify-center items-center font-thin border-b p-4 border-zinc-700'>
          Home
        </div>
        <div className='text-zinc-800 w-full h-full border-r border-t flex justify-center items-center font-thin border-b p-4 border-zinc-700'>
          About
        </div>
        <div className='text-zinc-800 w-full h-full border-r border-t flex justify-center items-center font-thin border-b p-4 border-zinc-700'>
          Contact
        </div>
        <div className='text-zinc-800 gap-3 w-full h-full border-r border-t flex justify-center items-center font-thin border-b p-4 border-zinc-700'>
          Search
          <Search size={16} />
        </div>
        <div className='text-zinc-800 gap-3 w-full h-full border-r border-t flex justify-center items-center font-thin border-b p-4 border-zinc-700'>
          <Facebook />
          <Instagram />
          <Youtube />
          <Twitter />
        </div>
        <div className='text-zinc-800 w-full h-full border-t border-b flex justify-center items-center font-thin p-4 border-zinc-700'></div>
      </div>
    </div>
  )
}

export default Header2
