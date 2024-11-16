'use client'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Loader, ScanSearch } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '../Components/Input'
import BlogPostCard from '../Components/BlogPostCard'
import { Helmet } from 'react-helmet'
const LoadMore = dynamic(() => import('../Components/LoadMore'), { ssr: false })

const SearchPage = () => {
  const router = useRouter()

  // Wrap useSearchParams inside Suspense
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent router={router} />
    </Suspense>
  )
}

const SearchContent = ({ router }) => {
  const searchParams = useSearchParams()

  const [showHeroSection, setShowHeroSection] = useState(true)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )
  const [resultQuery, setResultQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page')) || 1
  )
  const [totalPages, setTotalPages] = useState(null)
  const [totalPosts, setTotalPosts] = useState(null)
  const [searching, setSearching] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    if (searchQuery) {
      fetchSearchPosts(currentPage)
    }
  }, [])

  const fetchSearchPosts = async (page, e) => {
    if (e) e.preventDefault()

    if (resultQuery !== searchQuery) {
      page = 1
      setPosts([])
    }

    if (searchQuery === '') {
      enqueueSnackbar('Enter a valid query!')
      return
    }

    try {
      setIsEmpty(false)
      setSearching(true)
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
      if (response.data.posts.length === 0) {
        setIsEmpty(true)
      }
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts])
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setTotalPosts(response.data.totalPosts)
      router.replace(`/search/?search=${searchQuery}`)
    } catch (error) {
      enqueueSnackbar('Failed to fetch search results.', { variant: 'error' })
    } finally {
      setSearching(false)
    }
  }

  const handleLoadMore = async (e) => {
    e.preventDefault()
    const newPage = currentPage + 1
    await fetchSearchPosts(newPage, e)
  }

  return (
    <div className='min-h-[590px] w-full max-md:px-6'>
      <Helmet>
        <title>Search here - The Fashion Salad</title>
      </Helmet>
      {/* Hero Section */}
      {showHeroSection && (
        <div className='h-[450px] w-full flex flex-col justify-center items-center text-center'>
          <h2 className='text-4xl font-bold mb-4'>
            Find What You’re Looking For
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            Search through our collection of resources and discover something
            new today.
          </p>
          <div className='max-md:px-10 flex items-center flex-col justify-center'>
            <form
              onSubmit={(e) => fetchSearchPosts(currentPage, e)}
              className='flex px-5 max-md:w-[85%] justify-between items-center border border-dashed border-first'
            >
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type='text'
                placeholder='Search...'
                className='w-[350px] md:w-[500px] py-4 focus:outline-none'
              />
              <button
                title='Search'
                onClick={(e) => fetchSearchPosts(currentPage, e)}
                className=''
              >
                {searching ? (
                  <Loader className='text-first animate-spin' size={24} />
                ) : (
                  <ScanSearch className='text-gray-500' size={24} />
                )}
              </button>
            </form>
            {isEmpty && (
              <p className='text-lg text-neutral-500 py-5'>No data found</p>
            )}
          </div>
        </div>
      )}
      {!showHeroSection && (
        <div className='container pt-10 mx-auto'>
          <div className='flex max-md:flex-col-reverse max-md:gap-3 justify-between'>
            <div>
              <h3 className='text-5xl max-md:text-xl font-[900]'>
                Search Result for {resultQuery}
              </h3>
            </div>
            <div>
              <form onSubmit={(e) => fetchSearchPosts(currentPage, e)}>
                <div className='relative lg:w-[400px]'>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={'Type and hit enter ..'}
                  />
                  {searching && (
                    <Loader
                      className='text-first absolute top-2 right-3 animate-spin'
                      size={24}
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className='py-10 max-md:grid-cols-1 grid grid-cols-3 gap-10'>
            {posts.length > 0 &&
              posts.map((post, index) => (
                <BlogPostCard
                  post={post}
                  imageUrl={`https://picsum.photos/178/3${index}8`}
                  key={index}
                />
              ))}
          </div>
        </div>
      )}

      {totalPosts > posts.length && (
        <LoadMore onClick={(e) => handleLoadMore(e)} />
      )}
    </div>
  )
}

export default SearchPage
