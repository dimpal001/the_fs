import React from 'react'

const Paggination = ({
  handlePreviousPage,
  handleNextPage,
  currentPage,
  totalPages,
}) => {
  return (
    <div>
      {totalPages > 0 && (
        <div className='flex justify-end items-center mt-3'>
          <button
            onClick={handlePreviousPage}
            className='rounded-sm border-first border hover:bg-first hover:text-white text-first px-2 py-1 w-24'
          >
            Previous
          </button>
          <p className='border-t border-b text-first border-first py-1 px-4'>
            {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNextPage}
            className='rounded-sm border-first border hover:bg-first hover:text-white text-first px-2 py-1 w-24'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Paggination
