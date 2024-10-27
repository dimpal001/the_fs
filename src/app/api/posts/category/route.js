import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') // Fetch slug from the query params

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '9', 10)
  const offset = (page - 1) * limit

  try {
    // Fetch the category_id and name from Categories table using the slug
    const [[category]] = await db.query(
      `SELECT * FROM Categories WHERE slug = ?`,
      [slug]
    )

    // If no category is found, return an error response
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    // Fetch the total number of posts for the category
    const [[{ totalCount }]] = await db.query(
      `SELECT COUNT(*) AS totalCount FROM BlogPosts ` +
        `WHERE JSON_CONTAINS(BlogPosts.category_ids, ?)`,
      [JSON.stringify(category.slug)]
    )

    // Fetch the posts for the specified category
    const [posts] = await db.query(
      `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.slug, SUBSTRING(BlogPosts.content, 1, 150) AS content, BlogPosts.author_id, BlogPosts.image_url, BlogPosts.category_ids, BlogPosts.created_at, BlogPosts.updated_at, BlogPosts.status, Users.name as author_name, Users.image_url as author_image ` +
        `FROM BlogPosts ` +
        `JOIN Users ON BlogPosts.author_id = Users.id ` +
        `WHERE JSON_CONTAINS(BlogPosts.category_ids, ?) AND BlogPosts.status = 'approve' ` +
        `LIMIT ${limit} OFFSET ${offset}`,
      [JSON.stringify(category.slug)]
    )

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json(
      {
        success: true,
        posts,
        categoryName: category.name,
        currentPage: page,
        totalPages,
        totalPosts: totalCount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
