import BlogPostPage from './BlogPostPage'
import axios from 'axios'

// Function to fetch post data
async function fetchPost(slug) {
  const response = await axios.get(
    `https://www.thefashionsalad.com/api/posts/`,
    {
      params: { slug, status: 'view' },
    }
  )
  return response.data.post
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { slug } = params
  const post = await fetchPost(slug)

  if (!post) {
    return {
      title: 'Post not found',
      description: 'This post does not exist.',
      openGraph: {
        title: 'Post not found',
        description: 'This post does not exist.',
      },
    }
  }

  const { title, content, image_url, tags } = post
  const description =
    content.substring(0, 250) + (content.length > 250 ? '...' : '')

  const ogImageUrl = image_url
    ? `https://cdn.thefashionsalad.com/blog-post-images/${image_url}`
    : 'https://cdn.thefashionsalad.com/logos/logo-20241022T042118571Z-TheFashionSalad(3).png'

  const keywords = tags.join(', ')

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://www.thefashionsalad.com/blogs/${slug}`,
      images: [
        {
          url: ogImageUrl,
        },
      ],
    },
  }
}

const fetchReplies = async (postId) => {
  try {
    const response = await axios.get(
      `https://www.thefashionsalad.com/api/replies`,
      {
        params: { blog_post_id: postId },
      }
    )
    return response.data
  } catch (error) {}
}

// Main component
export default async function Page({ params }) {
  const { slug } = params
  const post = await fetchPost(slug)

  const replies = await fetchPost(post?.id)

  if (!post) {
    return { notFound: true }
  }

  return <BlogPostPage post={post} slug={slug} allReplies={replies} />
}
