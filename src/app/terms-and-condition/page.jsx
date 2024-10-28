'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../Components/Loading'
import { Helmet } from 'react-helmet'

const TermsAndConditionPage = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTermsAndConditonData = async () => {
      try {
        const response = await axios.get('/api/terms-and-condition')
        setContent(response.data.content)
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchTermsAndConditonData()
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
        <title>Terms & Conditions - The Fashion Salad</title>
      </Helmet>
      <h1 className='text-4xl lg:text-6xl py-4 font-bold mb-4 text-center'>
        Terms & Conditions
      </h1>
      <p className='lg:leading-[35px] leading-7 tracking-wide'>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </p>
    </div>
  )
}

export default TermsAndConditionPage
