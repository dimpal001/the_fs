'use client'

import React, { useEffect, useState } from 'react'
import { Ban, OctagonAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import BlogPostCard from './Components/BlogPostCard'
import LoadMore from './Components/LoadMore'
import Image from 'next/image'
import ErrorImg from '../../public/icons/404.png'
import { Helmet } from 'react-helmet'

const ErrorPage = ({ label }) => {
  const router = useRouter()
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/home-data', {
        params: { status: 'category_1' },
      })
      setPosts(response.data)
    } catch (error) {
      enqueueSnackbar('Failed fetching posts')
    }
  }

  const handleLoadMore = (slug) => {
    router.push(`/category/${slug}`)
  }

  useEffect(() => {
    fetchPosts()
  }, [])
  return (
    <div>
      <Helmet>
        <title>Page not found</title>
      </Helmet>
      <div className='container mx-auto'>
        <img
          src='https://picsum.photos/250/200'
          className='float-left mr-4 mb-4'
          alt='image'
        />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
          porro minus ducimus tempore corrupti at et sapiente blanditiis nobis,
          fugit laudantium laborum reprehenderit recusandae eum. Iusto, atque,
          harum natus dolorum eaque animi error assumenda ullam officia
          consectetur aliquid nihil officiis fugit dolore quia cum sint? Iure
          neque nobis nemo ea debitis eum. Aut ducimus consequuntur architecto
          incidunt voluptate corporis, amet deserunt, corrupti est laudantium
          ipsam assumenda veniam sequi hic repudiandae dolor. Nihil nobis labore
          inventore voluptas cumque id esse numquam consectetur fugit ullam amet
          illo dolores consequatur magnam, praesentium expedita cum culpa illum
          sit quas aliquid odit. Laboriosam similique quidem esse, aperiam
          possimus facere libero, sit asperiores dolorem mollitia velit nemo?
          Perferendis magni, recusandae voluptates impedit labore dicta debitis
          ad reprehenderit voluptas tempora qui nesciunt earum excepturi veniam
          ab ipsum. Aut minima nostrum molestias, inventore illo cum similique
          reprehenderit ut deserunt eligendi ratione ipsum voluptatem odio velit
          odit at distinctio quibusdam repellat, debitis et tenetur quas?
          Quisquam alias assumenda nesciunt aliquid expedita nisi, laboriosam
          maxime cumque magni nihil. Laudantium corrupti a animi esse, dolores
          consequuntur sapiente maxime magnam voluptatibus omnis ut veniam
          libero repudiandae, voluptas dolor illo unde quibusdam. Consectetur
          harum, voluptatem dolorem laboriosam fuga perspiciatis incidunt
          perferendis ea asperiores molestiae aliquam tempore sunt, aut facilis
          sint voluptates hic ipsam velit earum! Assumenda iure laborum
          voluptate perferendis voluptas iusto incidunt ratione, numquam commodi
          fugit nam ad unde veritatis quod quisquam eum! Repudiandae deserunt
          rem autem optio, dolore tempore asperiores cupiditate incidunt omnis
          id consequuntur reprehenderit, laborum reiciendis ad. Natus qui
          consequatur sed iure delectus animi, rem omnis expedita facilis iusto
          culpa cum voluptatibus eius officiis impedit, sit nobis eveniet
          doloribus pariatur obcaecati neque distinctio nemo. Voluptatibus
          repellat quos impedit cupiditate aut aspernatur. Nesciunt atque magni,
          vitae optio veritatis impedit pariatur reprehenderit, aperiam quam,
          eius dolorem amet soluta. Provident, ipsum sequi!
        </p>
      </div>

      {/* <div className='min-h-[400px] flex flex-col gap-1 justify-center items-center'>
        <div className='rounded-2xl max-lg:w-[250px] mb-10 lg:w-[370px]'>
          <Image
            className='rounded-t-2xl w-full h-full object-cover cursor-pointer'
            src={ErrorImg}
            width={0}
            height={0}
            sizes='100vw'
            alt={'Error page'}
          />
        </div>
        <p
          onClick={() => router.push('/')}
          className='text-first cursor-pointer font-semibold italic'
        >
          Back to Home
        </p>
      </div>
      <div className='min-h-[200px] max-md:px-6 container mx-auto'>
        {posts.length > 0 && (
          <div>
            <h2 className='text-6xl max-md:text-3xl font-[900]'>
              Suggested Posts
            </h2>
            <div className='grid pt-10 gap-16 grid-cols-2 max-md:grid-cols-1'>
              {posts?.map((post, index) => (
                <BlogPostCard
                  key={index}
                  post={post}
                  imageUrl={`https://picsum.photos/458/9${index}7`}
                />
              ))}
            </div>
            <div className='mt-10'>
              <LoadMore
                onClick={() => handleLoadMore(posts[0].category_ids[0])}
              />
            </div>
          </div>
        )}
      </div> */}
    </div>
  )
}

export default ErrorPage
