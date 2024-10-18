import React from 'react'

const DataNotFound = ({ label }) => {
  return (
    <div className='h-[500px] flex justify-center items-center'>
      <p className='lg:text-4xl text-2xl text-zinc-500'>
        {label ? label : 'No data found'}
      </p>
    </div>
  )
}

export default DataNotFound
