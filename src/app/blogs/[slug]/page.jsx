import BlogPostPage from './BlogPostPage'
import axios from 'axios'

export const metadata = async ({ params }) => {
  const { slug } = params

  let post

  try {
    const response = await axios.get(
      `https://www.thefashionsalad.com/api/posts/`,
      {
        params: { slug, status: 'view' },
      }
    )
    post = response.data.post

    if (!post) {
      return { notFound: true }
    }
  } catch (error) {
    return { notFound: true }
  }

  const { title, content, image_url, tags } = post
  const description =
    content.substring(0, 250) + (content.length > 250 ? '...' : '')
  const keywords = tags.join(', ')

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://www.thefashionsalad.com/blogs/${slug}`,
      type: 'article',
      images: [
        {
          url: 'https://cdn.thefashionsalad.com/blog-post-images/' + image_url,
        },
      ],
    },
  }
}

export default async function Page({ params }) {
  const { slug } = params

  let post

  try {
    const response = await axios.get(
      `https://www.thefashionsalad.com/api/posts/`,
      {
        params: { slug, status: 'view' },
      }
    )
    post = response.data.post

    if (!post) {
      return { notFound: true }
    }
  } catch (error) {
    return { notFound: true }
  }

  return (
    <>
      <BlogPostPage post={post} slug={slug} />
    </>
  )
}
