import Head from 'next/head'

const SEO = ({ title, tags, content, image_url, slug }) => {
  const description = content
  const blogUrl = 'https://thefashionsalad.com/blog-post-iamges/'

  return (
    <Head>
      {/* Standard meta tags */}
      <title key='title'>{title || 'The Fashion Salad'}</title>
      <meta name='description' content={description} />

      {/* Open Graph meta tags for social media sharing */}
      <meta property='og:title' content={title || 'The Fashion Salad'} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={blogUrl + image_url} />
      <meta property='og:url' content={`https://thefashionsalad.com/${slug}`} />
      <meta property='og:type' content='article' />

      {/* Twitter meta tags (optional) */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title || 'The Fashion Salad'} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={blogUrl + image_url} />

      {/* Keywords meta tag */}
      <meta
        name='keywords'
        content={
          tags?.length
            ? tags.join(', ')
            : 'fashion blog, tips, trends, blog, trending blog, blog, fashion, men clothing, women clothing, kid clothing, wedding, festivities'
        }
      />
    </Head>
  )
}

export default SEO
