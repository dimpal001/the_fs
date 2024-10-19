import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    let posts
    if (status === 'latest') {
      // Query for the latest posts with likes and replies count
      ;[posts] = await db.query(
        `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.created_at, BlogPosts.slug, BlogPosts.views,
                SUBSTRING(BlogPosts.content, 1, 250) AS content, 
                BlogPosts.category_ids, Users.name AS author_name, Users.id AS author_id,
                COUNT(DISTINCT Replies.id) AS replies,
                COUNT(DISTINCT Likes.id) AS likes
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         LEFT JOIN Replies ON BlogPosts.id = Replies.blog_post_id AND Replies.is_approved = 1
         LEFT JOIN Likes ON BlogPosts.id = Likes.blog_post_id
         WHERE BlogPosts.status = 'approve'
         GROUP BY BlogPosts.id
         ORDER BY BlogPosts.created_at DESC
         LIMIT 5`
      )
    } else if (status === 'category_1') {
      // Query for posts from a random category 1 with likes and replies count
      const [randomCategory] = await db.query(
        `SELECT id FROM Categories ORDER BY RAND() LIMIT 1`
      )
      const categoryId = randomCategory[0].id
      ;[posts] = await db.query(
        `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.created_at, BlogPosts.slug, BlogPosts.views,
                SUBSTRING(BlogPosts.content, 1, 150) AS content, 
                BlogPosts.category_ids, Users.name AS author_name, Users.id AS author_id,
                COUNT(DISTINCT Replies.id) AS replies,
                COUNT(DISTINCT Likes.id) AS likes
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         LEFT JOIN Replies ON BlogPosts.id = Replies.blog_post_id AND Replies.is_approved = 1
         LEFT JOIN Likes ON BlogPosts.id = Likes.blog_post_id
         WHERE BlogPosts.status = 'approve' 
         AND JSON_CONTAINS(BlogPosts.category_ids, '"${categoryId}"', '$')
         GROUP BY BlogPosts.id
         LIMIT 4`
      )
    } else if (status === 'category_2') {
      // Query for posts from a random category 2 with likes and replies count
      const [randomCategory] = await db.query(
        `SELECT id FROM Categories ORDER BY RAND() LIMIT 1`
      )
      const categoryId = randomCategory[0].id
      ;[posts] = await db.query(
        `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.created_at, BlogPosts.slug, BlogPosts.views,
                SUBSTRING(BlogPosts.content, 1, 150) AS content, 
                BlogPosts.category_ids, Users.name AS author_name, Users.id AS author_id,
                COUNT(DISTINCT Replies.id) AS replies,
                COUNT(DISTINCT Likes.id) AS likes
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         LEFT JOIN Replies ON BlogPosts.id = Replies.blog_post_id AND Replies.is_approved = 1
         LEFT JOIN Likes ON BlogPosts.id = Likes.blog_post_id
         WHERE BlogPosts.status = 'approve' 
         AND JSON_CONTAINS(BlogPosts.category_ids, '"${categoryId}"', '$')
         GROUP BY BlogPosts.id
         LIMIT 5`
      )
    } else if (status === 'hero_posts') {
      // Query for hero posts with likes and replies count
      ;[posts] = await db.query(
        `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.created_at, BlogPosts.slug, BlogPosts.views,
                SUBSTRING(BlogPosts.content, 1, 150) AS content, 
                BlogPosts.category_ids, Users.name AS author_name, Users.id AS author_id,
                COUNT(DISTINCT Replies.id) AS replies,
                COUNT(DISTINCT Likes.id) AS likes
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         LEFT JOIN Replies ON BlogPosts.id = Replies.blog_post_id AND Replies.is_approved = 1
         LEFT JOIN Likes ON BlogPosts.id = Likes.blog_post_id
         WHERE BlogPosts.isHeroPost = 1
         GROUP BY BlogPosts.id
         ORDER BY BlogPosts.created_at DESC`
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid status parameter' },
        { status: 400 }
      )
    }

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
