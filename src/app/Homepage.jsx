'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import SubscribeCard from './Components/SubscribeCard'
import HeroBlogCard from './Components/HeroBlogCard'
import { ArrowRight } from 'lucide-react'
import BlogPostCard from './Components/BlogPostCard'
import BlogPostCard3 from './Components/BlogPostCard3'
import BlogPostCard4 from './Components/BlogPostCard4'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Loading from './Components/Loading'
import { Helmet } from 'react-helmet'
import Link from 'next/link'
import SocialDiadies from './Components/SocialDiadies'
import { blogUrl } from './Components/url'
import { enqueueSnackbar } from 'notistack'

const HomePage = ({ heroPost, latestPost }) => {
  const [latestPosts, setLatestPosts] = useState(latestPost)
  const [heroPosts, setHeroPosts] = useState(heroPost)
  const [category1Posts, setCategory1Posts] = useState([])
  const [category2Posts, setCategory2Posts] = useState([])
  const [category3Posts, setCategory3Posts] = useState([])
  const [loadingLatest, setLoadingLatest] = useState(false)
  const [categories, setCategories] = useState([])

  const router = useRouter()

  //   const handleFetchHeroPosts = async () => {
  //     try {
  //       setLoadingLatest(true)
  //       const response = await axios.get(`/api/posts/home-data`, {
  //         params: { status: 'hero_posts' },
  //       })
  //       setHeroPosts(response.data)
  //     } catch (error) {
  //     } finally {
  //       setLoadingLatest(false)
  //     }
  //   }

  //   const handleFetchLatestPosts = async () => {
  //     try {
  //       const response = await axios.get(`/api/posts/home-data`, {
  //         params: { status: 'latest' },
  //       })
  //       setLatestPosts(response.data)
  //     } catch (error) {
  //     } finally {
  //     }
  //   }

  const handleFetchCategory1Posts = async () => {
    try {
      const response = await axios.get(`/api/posts/category`, {
        params: { slug: categories[0].slug },
      })
      setCategory1Posts((prev) => [...prev, ...response.data.posts])
    } catch (error) {}
  }

  const handleFetchCategory2Posts = async () => {
    try {
      const response = await axios.get(`/api/posts/category`, {
        params: { slug: categories[1].slug },
      })
      setCategory2Posts((prev) => [...prev, ...response.data.posts])
    } catch (error) {
      // enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  const handleFetchCategory3Posts = async () => {
    try {
      const response = await axios.get(`/api/posts/category`, {
        params: { slug: categories[2].slug },
      })
      setCategory3Posts((prev) => [...prev, ...response.data.posts])
    } catch (error) {
      // enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {
      // enqueueSnackbar('Faild fetching categories')
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    // setIsClient(true)
    handleFetchCategories()
    // handleFetchHeroPosts()
    // handleFetchLatestPosts()
  }, [])

  useEffect(() => {
    handleFetchCategory1Posts()
    handleFetchCategory2Posts()
    handleFetchCategory3Posts()
  }, [categories])

  if (loadingLatest) {
    return <Loading />
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const text = doc.body.textContent || ''
    return text.slice(0, 120)
  }

  const handleSeeMore = (slug) => {
    router.push(`/category/${slug}`)
  }

  return (
    <div>
      <div className='overflow-hidden'>
        <Helmet>
          <title>The Fashion Salad - Fashion blog</title>
          <meta
            name='description'
            content='Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now'
          />
          <meta
            name='keywords'
            content='the fashion salad, thefashionsalad, fashion, blogs, fashion blogs, beauty, lifestyle, trends, tips, sustainable fashion, vintage fashion, fashion blog'
          />

          {/* Open Graph / Facebook */}
          <meta
            property='og:title'
            content='The Fashion Salad - Fashion blog'
          />
          <meta
            property='og:description'
            content='Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now'
          />
          <meta property='og:url' content='https://www.thefashionsalad.com' />
          <meta property='og:type' content='website' />
          <meta
            property='og:image'
            content='https://cdn.thefashionsalad.com/logos/The%20Fashion%20Salad%20(3).png'
          />
          <meta property='og:site_name' content='The Fashion Salad' />
          <meta property='og:locale' content='en_US' />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />

          {/* Twitter */}
          <meta name='twitter:card' content='summary_large_image' />
          <meta
            name='twitter:title'
            content='The Fashion Salad - Fashion blog'
          />
          <meta
            name='twitter:description'
            content='Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now'
          />
          <meta
            name='twitter:image'
            content='https://cdn.thefashionsalad.com/logos/The%20Fashion%20Salad%20(3).png'
          />
        </Helmet>

        {/* New hero section  */}
        {heroPosts && heroPosts.length > 0 && (
          <section
            id='our-best'
            className='lg:h-[470px] lg:p-16 relative w-full gap-5 py-7 flex max-md:flex-col items-center'
          >
            <div className='lg:w-[28%] max-md:h-[300px] w-full h-full max-md:p-3'>
              <Link href={`/blogs/${heroPosts[0]?.slug}`}>
                <Image
                  src={blogUrl + heroPosts[0].image_url}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='rounded-[15px] w-full h-full object-cover cursor-pointer'
                  alt={'Image'}
                />
              </Link>
            </div>
            <div className='lg:w-[42%] h-full max-md:px-6 p-3 flex flex-col gap-6'>
              <Link href={`/blogs/${heroPosts[0]?.slug}`}>
                <h2 className='text-4xl hover:text-first font-bold'>
                  {heroPosts.length > 0 && heroPosts[0].title}
                </h2>
              </Link>
              <p className='text-stone-600 leading-5'>
                {stripHtml(heroPosts[0]?.content)}
              </p>
              <Link href={`/blogs/${heroPosts[0]?.slug}`}>
                <p className='text-2xl font-semibold hover:text-first cursor-pointer'>
                  Read More ..
                </p>
              </Link>
            </div>
            <div className='lg:w-[30%] w-full max-md:p-3 max-md:px-6 h-full flex flex-col gap-3'>
              {heroPosts.length > 0 &&
                heroPosts
                  .slice(1, 4)
                  .map((post, index) => (
                    <HeroBlogCard
                      key={index}
                      imageUrl={`https://picsum.photos/778/374`}
                      delay={0}
                      post={post}
                    />
                  ))}
              <Link href={`/category/${heroPosts[0].category_ids[0]}`}>
                <p className='font-semibold text-lg text-end hover:text-first cursor-pointer'>
                  Read More ..
                </p>
              </Link>
            </div>

            <div className='absolute max-md:hidden top-[20px] right-[270px] z-10 w-[330px] h-[330px] opacity-15 bg-amber-500 rounded-full filter' />
            <div className='absolute max-md:hidden top-[250px] right-[530px] w-[150px] h-[150px] opacity-15 bg-amber-500 rounded-full filter' />
            <div className='absolute max-md:hidden top-[350px] left-[390px] z-10 w-[100px] h-[100px] opacity-15 bg-amber-500 rounded-full filter' />
          </section>
        )}

        {/* Latest blog post section  */}
        <section id='latest-posts' className='p-10 lg:-mt-8 lg:p-16 max-md:p-5'>
          <div className='flex justify-between items-center'>
            <Link
              href={`/category/${
                latestPosts && latestPosts[0]?.category_ids[0]
              }`}
            >
              <h2 className='text-6xl capitalize max-md:text-3xl font-[900]'>
                Latest Blog Posts
              </h2>
            </Link>
            <Link
              href={`/category/${
                latestPosts && latestPosts[0]?.category_ids[0]
              }`}
            >
              <ArrowRight
                size={50}
                className='cursor-pointer hover:text-first'
                strokeWidth={2}
              />
            </Link>
          </div>
          <div className='grid max-md:grid-cols-1 grid-cols-2 py-10 gap-20 max-md:gap-10'>
            {latestPosts &&
              latestPosts.length > 0 &&
              latestPosts.slice(0, 2).map((post, index) => (
                <BlogPostCard
                  key={post.id} // Add a key prop for unique identification
                  imageUrl={`https://picsum.photos/778/3${index}7`}
                  date={new Date().toDateString()}
                  post={post}
                />
              ))}
          </div>
        </section>

        {/* Latest blog post with Subscribe box section  */}
        <section
          id='subscribe'
          className='grid max-md:grid-cols-1 grid-cols-3 max-md:p-5 p-10 lg:p-16 pt-10 lg:-mt-16 gap-14'
        >
          <SubscribeCard />
          {latestPosts &&
            latestPosts.length > 0 &&
            latestPosts.slice(2, -1).map((post, index) => (
              <BlogPostCard4
                key={post.id} // Add a key prop for unique identification
                imageUrl={`https://picsum.photos/778/3${index}4`}
                date={new Date().toDateString()}
                post={post}
              />
            ))}
        </section>

        {/* Category 1 blog post section  */}
        <section className='p-10 lg:p-16 max-md:p-5 lg:-mt-16'>
          <div className='relative'>
            <Link href={`/category/${category1Posts[0]?.category_ids[0]}`}>
              <h3 className='text-6xl capitalize max-md:text-3xl font-[900]'>
                {categories[0]?.name}
              </h3>
            </Link>
            <p className='text-neutral-400 max-md:text-sm pt-1'>
              The Fashion Salad latest update
            </p>
            <div className='absolute -top-20 -left-20 z-10 w-[190px] h-[190px] opacity-15 bg-gradient-to-b from-amber-400 to-amber-800 rounded-full filter' />
          </div>
          {/* <div className='h-[0.5px] bg-neutral-300 my-10'></div> */}
          <div className='pt-10'>
            {category1Posts?.map((post, index) => (
              <BlogPostCard3
                key={index}
                post={post}
                imageUrl={`https://picsum.photos/878/3${index}8`}
              />
            ))}
          </div>
        </section>

        {/* Category 2 blog post section  */}
        <section className='p-10 lg:p-16 max-md:p-5 -mt-16'>
          <div className='relative'>
            <Link href={`/category/${category2Posts[0]?.category_ids[0]}`}>
              <h4 className='text-6xl capitalize max-md:text-3xl font-[900]'>
                {categories[1]?.name}
              </h4>
            </Link>
            <p className='text-neutral-400 max-md:text-sm pt-1'>
              The Fashion Salad latest update
            </p>
            <div className='absolute -top-10 -right-24 z-10 w-[190px] h-[190px] opacity-15 bg-gradient-to-b from-amber-400 to-amber-800 rounded-full filter' />
            <div className='absolute top-[130px] -right-14 z-10 w-[80px] h-[80px] opacity-15 bg-gradient-to-b from-amber-400 to-amber-800 rounded-full filter' />
          </div>
          {/* <div className='h-[0.5px] bg-neutral-300 my-10'></div> */}
          <div className='pt-10 pb-16'>
            {category2Posts?.slice(0, 1).map((post, index) => (
              <BlogPostCard3
                key={index}
                post={post}
                imageUrl={`https://picsum.photos/858/3${index}4`}
              />
            ))}
            <div className='grid max-md:grid-cols-1 grid-cols-3 gap-5'>
              {category2Posts?.slice(1, -1).map((post, index) => (
                <BlogPostCard4
                  key={index}
                  post={post}
                  imageUrl={`https://picsum.photos/778/3${index}7`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Instagram section  */}
        <section
          id='social-diaries'
          className='flex w-full lg:-mt-14 gap-10 max-md:p-5 max-md:flex-col p-10 lg:p-16'
        >
          <SocialDiadies />
        </section>

        {category3Posts.length > 0 && (
          <section className='p-10 lg:p-16 max-md:p-5'>
            <div className='flex justify-between items-center'>
              <Link href={`/category/${category3Posts[0]?.category_ids[0]}`}>
                <h6 className='text-6xl capitalize max-md:text-3xl font-[900]'>
                  {categories[2]?.name}
                </h6>
              </Link>
            </div>
            <div className='grid max-md:grid-cols-1 grid-cols-3 py-10 gap-14 max-md:gap-5'>
              {category3Posts &&
                category3Posts.length > 0 &&
                category3Posts
                  .slice(0, 3)
                  .map((post, index) => (
                    <BlogPostCard
                      key={post.id}
                      imageUrl={`https://picsum.photos/548/3${index}1`}
                      date={new Date().toDateString()}
                      post={post}
                    />
                  ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default HomePage
