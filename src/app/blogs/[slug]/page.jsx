import BlogPostPage from './BlogPostPage'
import axios from 'axios'

export default async function Page({ params }) {
  const { slug } = params

  console.log(slug)

  try {
    const response = await axios.get(
      `https://www.thefashionsalad.com/api/posts/`,
      {
        params: { slug, status: 'view' },
      }
    )
    const post = response.data.post

    // Check if the post is found
    if (!post) {
      // Return notFound response for Next.js
      return { notFound: true }
    }

    // Pass the post data to the BlogPostPage component
    return <BlogPostPage post={post} slug={slug} />
  } catch (error) {
    console.error(error)
    // Handle error: return a notFound response if fetching fails
    return { notFound: true }
  }
}
