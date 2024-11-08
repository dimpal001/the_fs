import React from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'

// Conditionally load the HomePage component only on the client side
const HomePage = dynamic(() => import('./Homepage'), { ssr: false })

const handleFetchHeroPosts = async () => {
  try {
    const response = await axios.get(
      `https://thefashionsalad.com/api/posts/home-data`,
      {
        params: { status: 'hero_posts' },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching hero posts:', error)
    return null
  }
}

const handleFetchLatestPosts = async () => {
  try {
    const response = await axios.get(
      `https://thefashionsalad.com/api/posts/home-data`,
      {
        params: { status: 'latest' },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return null
  }
}

const Page = async () => {
  const heroPosts = await handleFetchHeroPosts()
  const latestPosts = await handleFetchLatestPosts()

  // Pass data to client-only HomePage
  return <HomePage heroPost={heroPosts} latestPost={latestPosts} />
}

export default Page
