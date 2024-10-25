import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronsRight } from 'lucide-react'
import { blogUrl } from './url'

const BlogPostCard3 = ({ title, imageUrl, post, onClick }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/blogs/${post?.slug}`)
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  return (
    <div className='flex max-md:flex-col py-7 border-t transition-all duration-75 h-full items-center'>
      {/* Image Section */}
      <div
        onClick={handleClick}
        className='lg:h-[200px] rounded-2xl lg:w-[340px] w-full max-md:h-[150px] h-[100px] cursor-pointer'
      >
        <Image
          className='rounded-2xl w-full h-full object-cover cursor-pointer'
          onClick={onClick}
          src={blogUrl + post?.image_url}
          width={0}
          height={0}
          sizes='100vw'
          alt={title || 'The fashion salad'}
        />
      </div>

      {/* Text Section */}
      <div className='lg:p-7 py-7 flex flex-col h-full w-full justify-between'>
        {/* Title */}
        <p className='text-sm text-neutral-500'>
          {new Date(post?.created_at).toDateString()}
        </p>{' '}
        <h3
          onClick={handleClick}
          className='text-lg cursor-pointer lg:py-3 lg:text-4xl font-semibold'
        >
          {post?.title}
        </h3>
        <p className='text-neutral-500'>{stripHtml(post?.content)}</p>
        {/* Author Details */}
        <div className='flex mt-12 justify-between items-center'>
          <div className='flex items-center gap-14'>
            <div className='flex gap-4 text-neutral-500 max-md:text-xs text-sm'>
              <p>{post?.views} Views</p>
              <p>{post?.likes} Likes</p>
              <p>{post?.replies} Replies</p>
            </div>
          </div>
          <div
            onClick={handleClick}
            className='flex items-center hover:text-first gap-0 text-neutral-600 transition-all duration-300 hover:gap-2 cursor-pointer'
          >
            <p className='font-semibold'>Read more</p>
            <ChevronsRight />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostCard3
