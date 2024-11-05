import Head from 'next/head'
import BlogPostPage from './BlogPostPage'
import axios from 'axios'

export default async function Page({ params }) {
  const { slug } = params

  console.log(slug)

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
    console.error(error)
    return { notFound: true }
  }

  const { title, content, image_url, tags } = post

  const description =
    content.substring(0, 250) + (content.length > 250 ? '...' : '')

  const keywords = tags.join(', ')

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={image_url} />
        <meta
          property='og:url'
          content={`https://www.thefashionsalad.com/blogs/${slug}`}
        />
        <meta property='og:type' content='article' />
        <meta name='keywords' content={keywords} />
      </Head>
      <BlogPostPage post={post} slug={slug} />
    </>
  )
}
