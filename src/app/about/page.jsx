'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../Components/Loading'

const AboutPage = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('/api/about')
        setContent(response.data.content)
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className='p-5 container mx-auto lg:px-56'>
      <h1 className='text-4xl lg:text-6xl py-4 font-bold mb-4 text-center'>
        About Us
      </h1>
      <p className='leading-[35px] tracking-wide'>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </p>
    </div>
  )
}

export default AboutPage
