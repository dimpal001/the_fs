import React from 'react'
import axios from 'axios'
import HomePage from './Homepage'

// Fetching data
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
  } finally {
  }
}

const Page = async () => {
  // Fetch data
  const heroPosts = await handleFetchHeroPosts()
  const latestPosts = await handleFetchLatestPosts()

  return <HomePage heroPost={heroPosts} latestPost={latestPosts} />
}

export default Page
