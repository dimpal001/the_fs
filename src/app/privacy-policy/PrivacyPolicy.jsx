'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../Components/Loading'
import { Helmet } from 'react-helmet'

const PrivacyPolicyPage = ({ initialContent }) => {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPrivacyPolicyData = async () => {
      try {
        const response = await axios.get('/api/privacy-policy')
        setContent(response.data.content)
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchPrivacyPolicyData()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className='p-5 container mx-auto lg:px-56'>
      <Helmet>
        <title>Privacy Policy - The Fashion Salad</title>
      </Helmet>
      <h2 className='text-4xl lg:text-6xl py-4 font-bold mb-4 text-center'>
        Privacy Policy
      </h2>
      <p className='lg:leading-[35px] leading-7 tracking-wide'>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </p>
    </div>
  )
}

export default PrivacyPolicyPage
