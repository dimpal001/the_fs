'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../Components/Loading'
import { Helmet } from 'react-helmet'

const AboutPage = ({ initialContent }) => {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true)
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
      <Helmet>
        <title>About Us - The Fashion Salad</title>
        <meta
          name='description'
          content='Learn more about The Fashion Salad, our mission, and what we do.'
        />
        <meta
          name='keywords'
          content='about, fashion salad, our mission, team, story'
        />
        <link rel='icon' href='/favicon.ico' />
      </Helmet>

      <h1 className='text-4xl lg:text-6xl py-4 font-bold mb-4 text-center'>
        About Us
      </h1>
      <div
        className='lg:leading-[35px] leading-7 tracking-wide'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

// Static generation for SEO
export async function getStaticProps() {
  let initialContent = ''

  try {
    const response = await axios.get('https://thefashionsalad.com/api/about')
    initialContent = response.data.content
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }

  return {
    props: { initialContent },
    revalidate: 60,
  }
}

export default AboutPage
