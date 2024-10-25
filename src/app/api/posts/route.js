import { NextResponse } from 'next/server'
import { db } from '../../../utils/db'
import { sendBlogPostAlert } from '@/utils/sendBlogPostAlert'
import slugify from 'slugify'
import { emailQueue } from '../../../utils/bullQueue'

export async function POST(request) {
  try {
    const { title, content, author_id, category_ids, status, tags, image_url } =
      await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      )
    }

    // Generate slug from title and append part of current timestamp
    const timeSuffix = Date.now().toString().slice(-4)
    const slug = `${slugify(title, {
      lower: true,
      strict: true,
    })}-${timeSuffix}`

    // Insert the post into the BlogPosts table with the generated slug
    await db.query(
      'INSERT INTO BlogPosts (title, content, author_id, category_ids, created_at, updated_at, status, tags, slug, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        content,
        author_id,
        category_ids,
        new Date(),
        new Date(),
        status,
        tags,
        slug,
        image_url,
      ]
    )

    return NextResponse.json(
      { message: 'Post created successfully', slug },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const viewerId = searchParams.get('viewerId')
  const slug = searchParams.get('slug')
  const userId = searchParams.get('userId')
  const isHeroPost = searchParams.get('isHeroPost')
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit

  try {
    // Single post
    if (id) {
      if (status === 'view') {
        await db.query(`UPDATE BlogPosts SET views = views + 1 WHERE id = ?`, [
          id,
        ])
      }

      const [post] = await db.query(
        `SELECT BlogPosts.*, 
                Users.name AS author_name, Users.image_url as author_image,
                Users.email AS author_email,
                COUNT(DISTINCT Replies.id) AS replies, 
                COUNT(DISTINCT Likes.id) AS likes
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         LEFT JOIN Replies ON BlogPosts.id = Replies.blog_post_id AND Replies.is_approved = 1
         LEFT JOIN Likes ON BlogPosts.id = Likes.blog_post_id
         WHERE BlogPosts.id = ?
         GROUP BY BlogPosts.id`,
        [id]
      )

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      return NextResponse.json(post, { status: 200 })
    }

    if (slug) {
      if (status === 'view') {
        await db.query(
          `UPDATE BlogPosts SET views = views + 1 WHERE slug = ?`,
          [slug]
        )
      }

      // Fetch the post along with author information
      const [post] = await db.query(
        `SELECT BlogPosts.*, Users.name as author_name, Users.email as author_email, Users.image_url as author_image
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         WHERE BlogPosts.slug = ?`,
        [slug]
      )

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      // Check if the user has liked the post
      const [likeCheck] = await db.query(
        `SELECT * FROM Likes WHERE user_id = ? AND blog_post_id = ?`,
        [viewerId, post[0].id]
      )

      const hasLiked = likeCheck.length > 0

      // Get the number of likes for the post
      const [likesCount] = await db.query(
        `SELECT COUNT(*) as likes FROM Likes WHERE blog_post_id = ?`,
        [post[0].id]
      )

      // Add the number of likes to the post data
      const postData = {
        ...post[0],
        likes: likesCount[0].likes,
      }

      return NextResponse.json({ post: postData, hasLiked }, { status: 200 })
    }

    // User posts
    if (userId) {
      const [posts] = await db.query(
        `SELECT BlogPosts.*, Users.name as author_name, Users.email as author_email, Users.image_url as author_image
         FROM BlogPosts 
         JOIN Users ON BlogPosts.author_id = Users.id 
         WHERE BlogPosts.author_id = ?`,
        [userId]
      )

      return NextResponse.json(posts, { status: 200 })
    }

    // Count total posts
    const [[{ totalPosts }]] = await db.query(
      `SELECT COUNT(*) as totalPosts FROM BlogPosts`
    )

    if (isHeroPost) {
      const [posts] = await db.query(
        `SELECT BlogPosts.*, Users.name as author_name, Users.email as author_email, Users.image_url as author_image
         FROM BlogPosts
         JOIN Users ON BlogPosts.author_id = Users.id
         WHERE isHeroPost = 1
         ORDER BY BlogPosts.created_at DESC`
      )

      return NextResponse.json({ posts }, { status: 200 })
    }

    if (type) {
      const totalPages = Math.ceil(totalPosts / limit)

      // All posts
      const [posts] = await db.query(
        `SELECT BlogPosts.*, Users.name as author_name, Users.email as author_email, Users.image_url as author_image
       FROM BlogPosts
       JOIN Users ON BlogPosts.author_id = Users.id
       WHERE BlogPosts.status = ?
       ORDER BY BlogPosts.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
        [type]
      )

      return NextResponse.json(
        {
          posts,
          current_page: page,
          total_pages: totalPages,
        },
        { status: 200 }
      )
    }

    const totalPages = Math.ceil(totalPosts / limit)

    // All posts
    const [posts] = await db.query(
      `SELECT BlogPosts.id, BlogPosts.title, BlogPosts.slug, BlogPosts.status, BlogPosts.image_url, BlogPosts.category_ids, Users.name as author_name, Users.email as author_email
       FROM BlogPosts
       JOIN Users ON BlogPosts.author_id = Users.id
       ORDER BY BlogPosts.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    )

    return NextResponse.json(
      {
        posts,
        current_page: page,
        total_pages: totalPages,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const isApprove = searchParams.get('status')
  const {
    title,
    content,
    category_ids,
    status,
    tags,
    postId,
    isHeroPost,
    image_url = null,
  } = await request.json()

  try {
    if (isApprove) {
      const result = await db.query(
        'UPDATE BlogPosts SET status = ? WHERE id = ?',
        [status, id]
      )

      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      const [slug] = db.query('SELECT slug FROM BlogPosts WHERE id = ?', [id])

      return NextResponse.json(
        { message: 'Post updated successfully' },
        { status: 200 }
      )
    }

    if (isHeroPost !== undefined) {
      // Check if the current post is already a hero post
      const [existingHeroPost] = await db.query(
        `SELECT id FROM BlogPosts WHERE isHeroPost = 1 AND id = ?`,
        [postId]
      )

      if (existingHeroPost.length > 0 && isHeroPost == 1) {
        // Only check if trying to set as hero post
        return NextResponse.json(
          { message: 'Another post is already marked as hero post' },
          { status: 400 }
        )
      }

      // Proceed to update the post
      const result = await db.query(
        `UPDATE BlogPosts SET isHeroPost = ? WHERE id = ?`,
        [isHeroPost, postId] // This will now accept 0 or 1
      )

      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 })
      }

      return NextResponse.json(
        { message: 'Post updated successfully' },
        { status: 200 }
      )
    }

    const [existingPost] = await db.query(
      'SELECT title, slug FROM BlogPosts WHERE id = ?',
      [id]
    )

    // Generate slug from title and append part of current timestamp
    const timeSuffix = Date.now().toString().slice(-4)
    const slug = `${slugify(title, {
      lower: true,
      strict: true,
    })}-${timeSuffix}`

    // Determine if the title has changed
    let newSlug = existingPost[0].slug
    if (title !== existingPost[0].title) {
      const timeSuffix = Date.now().toString().slice(-4)
      newSlug = `${slugify(title, { lower: true, strict: true })}-${timeSuffix}`
    }

    // Update the blog post with the new or existing slug
    const result = await db.query(
      'UPDATE BlogPosts SET title = ?, category_ids = ?, content = ?, status = ?, updated_at = ?, tags = ?, image_url = ?, slug = ? WHERE id = ?',
      [
        title,
        category_ids,
        content,
        status,
        new Date(),
        tags,
        image_url,
        newSlug,
        id,
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Post updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const result = await db.query('DELETE FROM BlogPosts WHERE id = ?', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}
