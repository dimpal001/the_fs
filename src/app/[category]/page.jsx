import React from 'react'

const page = ({ params }) => {
  const category = params.category
  return <div className=''>{category && category}</div>
}

export default page
