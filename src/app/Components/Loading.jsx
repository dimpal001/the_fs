import { LoaderCircle } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='h-[500px] flex justify-center items-center'>
      {/* <p className='text-4xl text-zinc-500'>Loading...</p> */}
      <LoaderCircle size={60} className='animate-spin text-first' />
    </div>
  )
}

export default Loading
