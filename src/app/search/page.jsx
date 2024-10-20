'use client'

import axios from 'axios'
import { ScanSearch } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import React, { useState } from 'react'
import Input from '../Components/Input'
import BlogPostCard from '../Components/BlogPostCard'

const SearchPage = (params) => {
  const [showHeroSection, setShowHeroSection] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [resultQuery, setResultQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)

  const fetchSearchPosts = async (page, e) => {
    e.preventDefault()
    if (searchQuery === '') {
      enqueueSnackbar('Enter a valid query!')
      return
    }

    try {
      setResultQuery(searchQuery)
      const response = await axios.get('/api/posts/search', {
        params: {
          searchQuery: searchQuery,
          page: page,
        },
      })
      if (response.data.posts.length > 0) {
        setShowHeroSection(false)
      }
      setPosts(response.data.posts)
      console.log(posts)
    } catch (error) {}
  }

  return (
    <div className='min-h-[590px] w-full'>
      {/* Hero Section */}
      {showHeroSection && (
        <div className='h-[450px] w-full flex flex-col justify-center items-center text-center'>
          <h1 className='text-4xl font-bold mb-4'>
            Find What You’re Looking For
          </h1>
          <p className='text-lg text-gray-600 mb-8'>
            Search through our collection of resources and discover something
            new today.
          </p>
          <div className='max-md:px-10'>
            <div className='flex px-5 justify-between items-center border border-dashed border-first'>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type='text'
                placeholder='Search...'
                className='w-[350px] md:w-[500px] py-4 focus:outline-none'
              />
              <button
                onClick={(e) => fetchSearchPosts(currentPage, e)}
                className=''
              >
                <ScanSearch className='text-gray-500' size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
      {posts.length > 0 && (
        <div className='container py-10 mx-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='text-5xl max-md:text-3xl font-[900]'>
                Search Result for {resultQuery}
              </h2>
            </div>
            <div>
              <form onSubmit={(e) => fetchSearchPosts(currentPage, e)}>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={'Search'}
                />
              </form>
            </div>
          </div>
          <div className='py-10 grid grid-cols-3 gap-10'>
            {posts.map((post, index) => (
              <BlogPostCard
                post={post}
                imageUrl={`https://picsum.photos/178/3${index}8`}
                key={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
