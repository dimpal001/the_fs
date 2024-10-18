'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import SubscribeCard from './Components/SubscribeCard'
import HeroBlogCard from './Components/HeroBlogCard'
import { ArrowRight, ArrowRightFromLine } from 'lucide-react'
import BlogPostCard from './Components/BlogPostCard'
import BlogPostCard3 from './Components/BlogPostCard3'
import BlogPostCard4 from './Components/BlogPostCard4'
import axios from 'axios'
import { useBlogContext } from './context/BlogContext'
import { useRouter } from 'next/navigation'
import Loading from './Components/Loading'
import { useCategoryContext } from './context/CategoryContext'
import { Helmet } from 'react-helmet'
import Instagram from './../../public/icons/instagram_icon.svg'

const HomePage = () => {
  const [latestPosts, setLatestPosts] = useState([])
  const [category1Posts, setCategory1Posts] = useState([])
  const [category2Posts, setCategory2Posts] = useState([])
  const [loadingLatest, setLoadingLatest] = useState(true)
  const [categories, setCategories] = useState([])
  const [loadingCategory1, setLoadingCategory1] = useState(false)
  const [loadingCategory2, setLoadingCategory2] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const loadMoreRef = useRef(null)
  const { setSelectedCategoryId } = useCategoryContext()

  const { setSelectedPostId } = useBlogContext()
  const router = useRouter()

  const handleFetchLatestPosts = async () => {
    try {
      setLoadingLatest(true)
      const response = await axios.get(`/api/posts/home-data`, {
        params: { status: 'latest' },
      })
      console.log(response.data)
      setLatestPosts(response.data)
    } catch (error) {
    } finally {
      setLoadingLatest(false)
    }
  }

  const handleFetchCategory1Posts = async () => {
    try {
      setLoadingCategory1(true)
      const response = await axios.get(`/api/posts/home-data`, {
        params: { status: 'category_1' },
      })
      console.log(response.data)
      setCategory1Posts((prev) => [...prev, ...response.data])
    } catch (error) {
    } finally {
      setLoadingCategory1(false)
    }
  }

  const handleFetchCategory2Posts = async () => {
    try {
      setLoadingCategory2(true)
      const response = await axios.get(`/api/posts/home-data`, {
        params: { status: 'category_2' },
      })
      console.log(response.data)
      setCategory2Posts((prev) => [...prev, ...response.data]) // Append new posts
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoadingCategory2(false)
    }
  }

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {
      enqueueSnackbar('Faild fetching categories', { variant: 'error' })
    }
  }

  useEffect(() => {
    setIsClient(true)
    handleFetchLatestPosts()

    setTimeout(() => {
      handleFetchCategory1Posts()
      handleFetchCategory2Posts()
      handleFetchCategories()
    }, 3000)
  }, [])

  if (loadingLatest) {
    return <Loading />
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  const handleClick = (post) => {
    const formattedTitle = post.title
      ?.toLowerCase()
      .replace(/[?/:;'&*$#%.,!]/g, '')
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .trim()

    setSelectedPostId(post.id)
    router.push(`/blogs/${formattedTitle}`)
  }

  const handleSeeMore = (categoryId) => {
    console.log(categoryId)
    const category = categories.find((category) => category.id === categoryId)

    if (category) {
      const { id, name } = category

      const formattedTitle = name
        .toLowerCase()
        .replace(/[?/:;'&*$#%.,!]/g, '')
        .replace(/ /g, '-')
        .replace(/--+/g, '-')
        .trim()

      setSelectedCategoryId(id)
      localStorage.setItem('selectedCategoryId', id)
      localStorage.setItem('selectedCategoryName', name)

      router.push(`/category/${formattedTitle}`)
    } else {
      console.log('Category not found')
    }
  }

  return (
    <div>
      {isClient && (
        <div className='overflow-hidden'>
          <Helmet>
            <title>Fashion Blog - Clothes2Wear</title>
            <meta
              name='description'
              content='Discover the latest fashion trends and tips from our blog. Stay up-to-date with the hottest styles in fashion, beauty, and lifestyle.'
            />
            <meta
              name='keywords'
              content='fashion, beauty, lifestyle, trends, tips, sustainable fashion, vintage fashion, fashion blog'
            />
          </Helmet>

          {/* New hero section  */}
          <section className='lg:h-[470px] relative w-full gap-5 py-7 flex max-md:flex-col items-center'>
            <div className='lg:w-[28%] max-md:h-[300px] w-full h-full max-md:p-3 ps-3'>
              <Image
                src={'https://picsum.photos/685/979'}
                width={0}
                height={0}
                sizes='100vw'
                className='rounded-[15px]'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                alt={'Image'}
              />
            </div>
            <div className='lg:w-[42%] h-full max-md:px-6 p-3 flex flex-col gap-6'>
              <h2 className='text-4xl font-bold'>
                Lorem ipsum dolor sit amet consectetur.
              </h2>
              <p className='text-stone-600 leading-5'>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi
                ut sapiente recusandae. Eius sed numquam distinctio dolorum
                facere aperiam, praesentium aspernatur a, quam soluta veniam.
              </p>
              <p className='text-2xl font-semibold hover:text-first cursor-pointer'>
                Read More ..
              </p>
            </div>
            <div className='lg:w-[30%] h-full p-3 lg:pr-10 flex flex-col gap-3'>
              <HeroBlogCard
                imageUrl={`https://picsum.photos/778/374`}
                delay={0}
              />
              <HeroBlogCard
                imageUrl={`https://picsum.photos/788/374`}
                delay={1}
              />
              <HeroBlogCard
                imageUrl={`https://picsum.photos/958/374`}
                delay={2}
              />
              <p className='font-semibold text-lg text-end hover:text-first cursor-pointer'>
                Read More ..
              </p>
            </div>

            <div className='absolute max-md:hidden top-[20px] right-[270px] z-10 w-[330px] h-[330px] opacity-15 bg-amber-500 rounded-full filter' />
            <div className='absolute max-md:hidden top-[250px] right-[530px] w-[150px] h-[150px] opacity-15 bg-amber-500 rounded-full filter' />
            <div className='absolute max-md:hidden top-[350px] left-[390px] z-10 w-[100px] h-[100px] opacity-15 bg-amber-500 rounded-full filter' />
          </section>

          {/* Latest blog post section  */}
          <section className='p-10 max-md:p-5'>
            <div className='flex justify-between items-center'>
              <h2 className='text-6xl max-md:text-3xl font-[900]'>
                Latest Blog Posts
              </h2>
              <ArrowRight
                onClick={() => handleSeeMore(latestPosts[3].category_ids[0])}
                size={50}
                className='cursor-pointer hover:text-first'
                strokeWidth={2}
              />
            </div>
            <div className='grid max-md:grid-cols-1 grid-cols-2 lg:p-8 py-10 gap-28 max-md:gap-10'>
              {latestPosts &&
                latestPosts.length > 0 &&
                latestPosts.slice(0, 2).map((post, index) => (
                  <BlogPostCard
                    key={post.id} // Add a key prop for unique identification
                    imageUrl={`https://picsum.photos/778/9${index}7`}
                    date={new Date().toDateString()}
                    post={post}
                  />
                ))}
            </div>
          </section>

          {/* Latest blog post with Subscribe box section  */}
          <section className='grid max-md:grid-cols-1 grid-cols-3 max-md:p-5 p-10 pt-10 gap-14'>
            <SubscribeCard />
            {latestPosts &&
              latestPosts.length > 0 &&
              latestPosts.slice(0, 2).map((post, index) => (
                <BlogPostCard4
                  key={post.id} // Add a key prop for unique identification
                  imageUrl={`https://picsum.photos/778/5${index}4`}
                  date={new Date().toDateString()}
                  post={post}
                />
              ))}
          </section>

          {/* Category 1 blog post section  */}
          <section className='p-10 max-md:p-5 lg:-mt-32'>
            <div className='relative'>
              <h2 className='text-6xl max-md:text-3xl font-[900]'>
                LifeStyle blogs
              </h2>
              <p className='text-neutral-400 max-md:text-sm pt-1'>
                The Fashion Salad latest update
              </p>
              <div className='absolute -top-20 -left-20 z-10 w-[190px] h-[190px] opacity-15 bg-gradient-to-b from-amber-400 to-amber-800 rounded-full filter' />
            </div>
            {/* <div className='h-[0.5px] bg-neutral-300 my-10'></div> */}
            <div className='pt-10 lg:p-16'>
              {category2Posts?.map((post, index) => (
                <BlogPostCard3
                  key={index}
                  post={post}
                  imageUrl={`https://picsum.photos/778/3${index}8`}
                />
              ))}
            </div>
          </section>

          {/* Category 2 blog post section  */}
          <section className='p-10 max-md:p-5 -mt-16'>
            <div className='relative'>
              <h2 className='text-6xl max-md:text-3xl font-[900]'>
                Food & Drinks blogs
              </h2>
              <p className='text-neutral-400 max-md:text-sm pt-1'>
                The Fashion Salad latest update
              </p>
              <div className='absolute -top-10 -right-24 z-10 w-[190px] h-[190px] opacity-15 bg-gradient-to-b from-amber-400 to-amber-800 rounded-full filter' />
              <div className='absolute top-[130px] -right-14 z-10 w-[80px] h-[80px] opacity-15 bg-gradient-to-b from-amber-400 to-amber-800 rounded-full filter' />
            </div>
            {/* <div className='h-[0.5px] bg-neutral-300 my-10'></div> */}
            <div className='pt-10 lg:p-16'>
              {category2Posts?.slice(0, 1).map((post, index) => (
                <BlogPostCard3
                  key={index}
                  post={post}
                  imageUrl={`https://picsum.photos/778/3${index}4`}
                />
              ))}
              <div className='grid max-md:grid-cols-1 grid-cols-3 gap-5'>
                {category1Posts?.map((post, index) => (
                  <BlogPostCard4
                    key={index}
                    post={post}
                    imageUrl={`https://picsum.photos/778/3${index}7`}
                  />
                ))}
                {category1Posts?.map((post, index) => (
                  <BlogPostCard4
                    key={index}
                    post={post}
                    imageUrl={`https://picsum.photos/778/3${index}3`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Instagram section  */}
          <section className='flex lg:-mt-20 px-24 gap-10 max-md:p-5 max-md:flex-col p-10'>
            <div className='lg:w-1/3'>
              <div className='w-full relative h-[420px] max-md:h-[370px]'>
                <Image
                  src={'https://picsum.photos/745/749'}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='rounded-2xl opacity-40'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  alt={'Image'}
                />
                {/* Icon Section */}
                <div className='absolute inset-0 flex justify-center items-center'>
                  <Image
                    src={Instagram}
                    width={80}
                    height={80}
                    alt='Instagram'
                  />
                </div>
              </div>
            </div>
            <div className='lg:w-2/3 flex flex-col relative justify-between'>
              <div className='flex justify-between'>
                <div>
                  <p className='text-5xl max-md:text-3xl font-semibold'>
                    Follow us
                  </p>
                  <p className='text-8xl max-md:text-6xl font-bold'>
                    Instagram
                  </p>
                </div>
                <div>
                  <ArrowRight size={55} />
                </div>
              </div>
              <div className='grid grid-cols-4 max-md:mt-10 max-md:grid-cols-1 gap-5'>
                <div className='lg:w-[200px] w-full h-[230px]'>
                  <Image
                    src={'https://picsum.photos/775/749'}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='rounded-2xl'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    alt={'Image'}
                  />
                </div>
                <div className='lg:w-[200px] w-full h-[230px]'>
                  <Image
                    src={'https://picsum.photos/775/879'}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='rounded-2xl'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    alt={'Image'}
                  />
                </div>
                <div className='lg:w-[200px] w-full h-[230px]'>
                  <Image
                    src={'https://picsum.photos/775/259'}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='rounded-2xl'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    alt={'Image'}
                  />
                </div>
                <div className='lg:w-[200px] w-full h-[230px]'>
                  <Image
                    src={'https://picsum.photos/782/749'}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='rounded-2xl'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    alt={'Image'}
                  />
                </div>
              </div>
              <div className='absolute top-[20px]  right-[240px] z-10 w-[300px] h-[300px] opacity-15 bg-gradient-to-tr from-amber-300 to-red-800 rounded-full filter' />
            </div>
          </section>

          <section className='p-10 max-md:p-5'>
            <div className='flex justify-between items-center'>
              <h2 className='text-6xl max-md:text-3xl font-[900]'>Our best</h2>
              {/* <ArrowRight
                onClick={() => handleSeeMore(latestPosts[3].category_ids[0])}
                size={50}
                className='cursor-pointer hover:text-first'
                strokeWidth={2}
              /> */}
            </div>
            <div className='grid max-md:grid-cols-1 grid-cols-3 lg:p-8 py-10 gap-14 max-md:gap-5'>
              {latestPosts &&
                latestPosts.length > 0 &&
                latestPosts
                  .slice(0, 3)
                  .map((post, index) => (
                    <BlogPostCard
                      key={post.id}
                      imageUrl={`https://picsum.photos/548/5${index}1`}
                      date={new Date().toDateString()}
                      post={post}
                    />
                  ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default HomePage
