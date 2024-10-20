import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const searchQuery = searchParams.get('searchQuery') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '9', 10)
  const offset = (page - 1) * limit

  try {
    const queryWords = searchQuery
      .split(' ')
      .filter(Boolean)
      .map((word) => `%${word}%`)

    if (!queryWords.length) {
      return NextResponse.json(
        { message: 'Search query cannot be empty' },
        { status: 400 }
      )
    }

    // Dynamically create the WHERE clause for each query word
    const whereClause = queryWords
      .map(
        () =>
          `(title LIKE ? OR JSON_CONTAINS(category_ids, ?) OR JSON_CONTAINS(tags, ?))`
      )
      .join(' OR ')

    // Construct the SQL query for fetching posts
    const postsQuery = `
  SELECT 
    bp.title, 
    bp.tags, 
    bp.category_ids, 
    LEFT(bp.content, 150) AS content,
    bp.image_url, 
    bp.views AS views, 
    COUNT(l.id) AS likes,
    COUNT(r.id) AS replies,
    bp.slug, 
    bp.created_at, 
    u.name AS author_name
  FROM BlogPosts bp
  LEFT JOIN Likes l ON bp.id = l.blog_post_id
  LEFT JOIN Replies r ON bp.id = r.blog_post_id
  LEFT JOIN Users u ON bp.author_id = u.id
  WHERE ${whereClause}
  GROUP BY bp.id  -- Group by post id to ensure aggregation
  LIMIT ${limit} OFFSET ${offset}
`

    // Parameters for the main posts query
    const queryParams = queryWords.flatMap((word) => [
      word,
      JSON.stringify([word]),
      JSON.stringify([word]),
    ])

    const [posts] = await db.query(postsQuery, queryParams)

    const countQuery = `
      SELECT COUNT(*) as totalPosts FROM BlogPosts
      WHERE ${whereClause}
    `
    const countParams = queryWords.flatMap((word) => [
      word,
      JSON.stringify([word]),
      JSON.stringify([word]),
    ])

    const [totalCountResult] = await db.query(countQuery, countParams)
    const totalPosts = totalCountResult[0]?.totalPosts || 0
    const totalPages = Math.ceil(totalPosts / limit)

    // Return the paginated results
    return NextResponse.json(
      {
        currentPage: page,
        totalPages,
        totalPosts,
        posts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return NextResponse.json(
      { message: 'Error fetching related posts' },
      { status: 500 }
    )
  }
}
