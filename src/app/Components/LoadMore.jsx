import React from 'react'

const LoadMore = ({ onClick }) => {
  return (
    <div onClick={onClick} className='flex mt-10 justify-center'>
      <button className='text-lg px-5 py-2 border hover:bg-first hover:text-white font-thin border-first rounded-none text-first border-dotted'>
        Load More
      </button>
    </div>
  )
}

export default LoadMore
