import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProfileCard from './ProfileCard'
import { ChevronsRight } from 'lucide-react'
import { blogUrl } from './url'

const BlogPostCard = ({ title, imageUrl, post, onClick }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/blogs/${post?.slug}`)
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  return (
    <div className='flex flex-col shadow-lg rounded-2xl transition-all duration-75 h-full items-center lg:items-start lg:space-y-0'>
      {/* Image Section */}
      <div onClick={handleClick} className='rounded-2xl w-full'>
        <Image
          className='rounded-t-2xl aspect-video object-cover cursor-pointer'
          onClick={onClick}
          src={blogUrl + post?.image_url}
          width={1280}
          height={720}
          // sizes='100vw'
          alt={title || 'The fashion Salad'}
        />
      </div>

      {/* Text Section */}
      <div className='p-7'>
        <div className='flex gap-4 text-neutral-500 text-sm'>
          <p>{post?.views} Views</p>
          <p>{post?.likes} Likes</p>
          <p>{post?.replies} Replies</p>
        </div>
        {/* Title  */}
        <h3
          onClick={handleClick}
          className='text-lg cursor-pointer lg:py-2 lg:text-xl font-semibold'
        >
          {post?.title}
        </h3>

        {/* Content  */}
        <p className='text-base text-gray-600'>{stripHtml(post?.content)}...</p>

        {/* Author Details  */}
        <div className='flex justify-between mt-3'>
          <div className='flex justify-between items-center'>
            <ProfileCard
              name={post?.author_name}
              id={post?.author_id}
              date={post?.created_at}
              author_image={post?.author_image}
              role={post?.author_role}
            />
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

export default BlogPostCard
