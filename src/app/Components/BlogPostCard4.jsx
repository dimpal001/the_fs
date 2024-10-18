import { useRouter } from 'next/navigation'
import { useBlogContext } from '../context/BlogContext'
import Image from 'next/image'
import ProfileCard from './ProfileCard'
import { ChevronsRight } from 'lucide-react'

const BlogPostCard4 = ({ title, imageUrl, post, onClick }) => {
  const { setSelectedPostId } = useBlogContext()
  const router = useRouter()
  console.log(post)

  const handleClick = () => {
    const formattedTitle = post.title
      ?.toLowerCase()
      .replace(/[?/:;'&*$#%.,!]/g, '')
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .trim()

    localStorage.setItem('selectedPostId', post.id)
    setSelectedPostId(post.id)
    router.push(`/blogs/${post?.slug}`)
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  return (
    <div className='flex flex-col shadow-lg rounded-2xl transition-all duration-75 h-full items-center lg:items-start lg:space-y-0'>
      {/* Image Section */}
      <div
        onClick={handleClick}
        className='lg:h-[200px] rounded-2xl w-full h-[160px]'
      >
        <Image
          className='rounded-t-2xl'
          onClick={onClick}
          src={imageUrl}
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          alt={title}
        />
      </div>

      {/* Text Section */}
      <div className='p-7 flex flex-col gap-3'>
        <p className='text-neutral-500 text-sm'>
          {new Date(post?.created_at).toDateString()}
        </p>

        {/* Title  */}
        <h2
          onClick={handleClick}
          className='text-lg hover:text-first cursor-pointer lg:py-3 lg:text-xl font-semibold'
        >
          {post?.title}
        </h2>

        {/* Content  */}
        <p className='text-base text-gray-600'>{stripHtml(post?.content)}...</p>
        <div className='flex gap-4 text-neutral-500 text-sm'>
          <p>{post?.views} Views</p>
          <p>{post?.likes} Likes</p>
          <p>{post?.replies} Replies</p>
        </div>
      </div>
    </div>
  )
}

export default BlogPostCard4
