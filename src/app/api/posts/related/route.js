import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

// GET - Fetch related posts by category
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category_id = searchParams.get('category_id')

  if (!category_id) {
    return NextResponse.json(
      { error: 'Category id is required' },
      { status: 400 }
    )
  }

  try {
    const [posts] = await db.query(
      `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.author_id, BlogPosts.slug, BlogPosts.image_url,
              SUBSTRING(BlogPosts.content, 1, 150) AS content, 
              Users.name AS author_name , Users.image_url as author_image
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         WHERE JSON_CONTAINS(BlogPosts.category_ids, ?, '$') AND BlogPosts.status = 'approve'
         LIMIT 5`,
      [`"${category_id}"`]
    )

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching related posts' },
      { status: 500 }
    )
  }
}
