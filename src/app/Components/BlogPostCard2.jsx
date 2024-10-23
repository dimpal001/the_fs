import Image from 'next/image'
import ProfileCard from './ProfileCard'
import Button from './Button'
import { useRouter } from 'next/navigation'
import { useBlogContext } from '../context/BlogContext'

const BlogPostCard2 = ({ title, imageUrl, date, onClick, post }) => {
  const router = useRouter()
  const { setSelectedPostId } = useBlogContext()

  const handleClick = () => {
    router.push(`/blogs/${post?.slug}`)
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  return (
    <div className='w-full hover:scale-105 transition-all duration-75 rounded-[12px] shadow-md max-md:flex flex-col items-center mx-auto bg-'>
      <div
        onClick={handlePostClick}
        className='h-[100px] relative lg:h-[250px]'
      >
        <Image
          onClick={onClick}
          src={imageUrl}
          width={0}
          height={0}
          sizes='100vw'
          className='rounded-t-[12px]'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          alt={title}
        />
      </div>
      <div className='p-3 max-md:w-full max-md:flex flex-col'>
        <span className='text-xs text-gray-500'>
          {new Date(post?.created_at).toDateString()}
        </span>
        <h3
          onClick={handlePostClick}
          className='text-xl hover:text-first cursor-pointer font-semibold text-gray-800 mb-2'
        >
          {post?.title}
        </h3>
        <p className='text-sm text-zinc-600'>
          {stripHtml(post?.content.slice(0, 300))}
        </p>
        <div className='bg-gray-300 my-3 mt-11 h-[0.5px]'></div>
        <div className='flex justify-between items-center'>
          <ProfileCard
            name={post?.author_name}
            id={post?.author_id}
            author_image={post?.author_image}
          />
        </div>
      </div>
    </div>
  )
}

export default BlogPostCard2
