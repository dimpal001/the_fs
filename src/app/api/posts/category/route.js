import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url)
  const category_id = searchParams.get('id')
  console.log(category_id)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit

  try {
    // Fetch the total number of posts for the category
    const [[{ totalCount }]] = await db.query(
      `SELECT COUNT(*) AS totalCount FROM BlogPosts ` +
        `WHERE JSON_CONTAINS(BlogPosts.category_ids, ?)`,
      [JSON.stringify(category_id)]
    )

    // Fetch the posts for the specified category
    const [posts] = await db.query(
      `SELECT BlogPosts.id, BlogPosts.title, SUBSTRING(BlogPosts.content, 1, 150) AS content, BlogPosts.author_id, BlogPosts.category_ids, BlogPosts.created_at, BlogPosts.updated_at, BlogPosts.status, Users.name as author_name ` +
        `FROM BlogPosts ` +
        `JOIN Users ON BlogPosts.author_id = Users.id ` +
        `WHERE JSON_CONTAINS(BlogPosts.category_ids, ?) ` +
        `LIMIT ${limit} OFFSET ${offset}`,
      [JSON.stringify(category_id)]
    )

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit)

    // Return posts along with pagination information
    return NextResponse.json(
      {
        posts,
        currentPage: page,
        totalPages,
        totalPosts: totalCount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
