import { NextResponse } from 'next/server'
import { db } from '../../../utils/db'
import { CLS_NOCOLOR_ITEM } from '@syncfusion/ej2-richtexteditor'

// POST - Create a reply for a blog post
export async function POST(request) {
  const body = await request.json()
  const {
    blog_post_id,
    reply_to_id = null,
    author_id = null,
    name,
    link = null,
    content,
  } = body

  try {
    if (author_id) {
      // Reply by a registered user
      const result = await db.query(
        `
        INSERT INTO Replies (blog_post_id, reply_to_id, author_id, link, content)
        VALUES (?, ?, ?, ?, ?)
        `,
        [blog_post_id, reply_to_id, author_id, link, content]
      )

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { message: 'Failed to create reply' },
          { status: 400 }
        )
      }
    } else {
      // Reply by an anonymous user
      const result = await db.query(
        `
        INSERT INTO Replies (blog_post_id, reply_to_id, name, link, content)
        VALUES (?, ?, ?, ?, ?)
        `,
        [blog_post_id, reply_to_id, name, link, content]
      )

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { message: 'Failed to create reply' },
          { status: 400 }
        )
      }
    }

    // Successful creation
    return NextResponse.json(
      { message: 'Reply created successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating reply' },
      { status: 500 }
    )
  }
}

// GET - Fetch replies for a specific blog post
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const blog_post_id = searchParams.get('blog_post_id')
  const id = searchParams.get('id')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit

  try {
    if (blog_post_id) {
      const [replies] = await db.query(
        `SELECT r.*, u.name AS author_name 
         FROM Replies r 
         LEFT JOIN Users u ON r.author_id = u.id 
         WHERE r.blog_post_id = ? AND r.is_approved = ?`,
        [blog_post_id, 1]
      )

      return NextResponse.json(replies, { status: 200 })
    } else if (id) {
      const [replies] = await db.query(
        `SELECT r.*, u.name AS author_name 
         FROM Replies r 
         LEFT JOIN Users u ON r.author_id = u.id 
         WHERE r.id = ?`,
        [id]
      )

      return NextResponse.json(replies, { status: 200 })
    } else {
      // Count total replies
      const [[{ totalReplies }]] = await db.query(
        `SELECT COUNT(*) as totalReplies FROM Replies`
      )

      const totalPages = Math.ceil(totalReplies / limit)

      const [replies] = await db.query(
        `SELECT r.id, r.link, r.blog_post_id, r.is_approved, r.name, r.created_at, u.name AS author_name, 
        LEFT(r.content, 50) AS content
         FROM Replies r LEFT JOIN Users u ON r.author_id = u.id 
         ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}`
      )

      return NextResponse.json(
        { replies, current_page: page, total_pages: totalPages },
        { status: 200 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching replies' },
      { status: 500 }
    )
  }
}

// PATCH - Update reply status (approve or reject)
export async function PATCH(request) {
  const { id, status } = await request.json()

  try {
    const result = await db.query(
      `
      UPDATE Replies
      SET is_approved = ?
      WHERE id = ?
    `,
      [1, id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Reply not found or status not updated' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Reply status updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating reply status' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a single reply
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { message: 'Reply ID is required' },
      { status: 400 }
    )
  }

  try {
    const [result] = await db.query('DELETE FROM Replies WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Reply not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Reply deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting reply' },
      { status: 500 }
    )
  }
}
