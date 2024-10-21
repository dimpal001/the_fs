import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import { emailQueue } from '../../../../utils/bullQueue'

async function sendBlogPostNotification(slug) {
  try {
    const [emails] = await db.query(`SELECT email FROM Subscribers`)
    const link = `https://www.thefashionsalad.com/blogs/${slug}`

    emailQueue.add({ emails, link })
    console.log('Email notification sent successfully')
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
}

export async function PATCH(request, { params }) {
  const { id } = params
  const body = await request.json()
  const { status, reject_note } = body

  try {
    const result = await db.query(
      'UPDATE BlogPosts SET status = ?, reject_note = ? WHERE id = ?',
      [status, reject_note || null, id]
    )

    const [blog] = await db.query(`SELECT * FROM BlogPosts WHERE id = ?`, [id])

    const formattedTitle = blog[0].title
      ?.toLowerCase()
      .replace(/[?/:;'&*$#%.,!]/g, '')
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .trim()

    if (status === 'approve') {
      console.log('Email sent')
      const [rows] = await db.query('SELECT slug FROM BlogPosts WHERE id = ?', [
        id,
      ])
      const slug = rows[0]?.slug

      console.log('Email sent')
      const [emails] = await db.query(`SELECT email FROM Subscribers`)
      const link = `https://www.thefashionsalad.com/blogs/${slug}`

      sendBlogPostNotification(slug)
    }

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Post updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    const result = await db.query('DELETE FROM BlogPosts WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}
