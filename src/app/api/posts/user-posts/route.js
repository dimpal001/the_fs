import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const status = searchParams.get('status')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit

  try {
    // Single post
    if (id) {
      const [posts] = await db.query(
        `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.slug, BlogPosts.image_url, BlogPosts.created_at, BlogPosts.views, BlogPosts.replies,
                BlogPosts.likes,
                Users.name as author_name, Users.image_url as author_image,
                Users.email as author_email,
                SUBSTRING(BlogPosts.content, 1, 100) as content 
             FROM BlogPosts 
             JOIN Users ON BlogPosts.author_id = Users.id 
             WHERE BlogPosts.author_id = ? AND BlogPosts.status = ? LIMIT ${limit} OFFSET ${offset}`,
        [id, status]
      )

      const totalPages = Math.ceil(posts / limit)

      return NextResponse.json(
        {
          posts,
          current_page: page,
          total_pages: totalPages,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 })
  }
}
