import { useBlogContext } from '../context/BlogContext'

export const handlePostClick = (post) => {
  const { setSelectedPostId } = useBlogContext()
  const formattedTitle = post.title
    .toLowerCase()
    .replace(/[?/:;'&*$#%.,!]/g, '')
    .replace(/ /g, '-')
    .replace(/--+/g, '-')
    .trim()

  setSelectedPostId(post.id)
  router.push(`/blogs/${formattedTitle}`)
}
