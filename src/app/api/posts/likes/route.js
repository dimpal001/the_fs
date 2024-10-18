// pages/api/likes.js

import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

export async function POST(request) {
  const { user_id, blog_post_id } = await request.json()

  try {
    // Check if the like already exists
    const [existingLike] = await db.query(
      `SELECT * FROM Likes WHERE user_id = ? AND blog_post_id = ?`,
      [user_id, blog_post_id]
    )

    if (existingLike.length > 0) {
      return NextResponse.json(
        { message: 'You already liked this post' },
        { status: 400 }
      )
    }

    // Insert a new like
    await db.query(`INSERT INTO Likes (user_id, blog_post_id) VALUES (?, ?)`, [
      user_id,
      blog_post_id,
    ])

    // Increment the likes count in BlogPosts table
    await db.query(`UPDATE BlogPosts SET likes = likes + 1 WHERE id = ?`, [
      blog_post_id,
    ])

    return NextResponse.json(
      { message: 'Post liked successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json({ error: 'Error liking post' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { user_id, blog_post_id } = await request.json()

  try {
    const [existingLike] = await db.query(
      `SELECT * FROM Likes WHERE user_id = ? AND blog_post_id = ?`,
      [user_id, blog_post_id]
    )

    if (existingLike.length === 0) {
      return NextResponse.json(
        { message: 'You have not liked this post yet' },
        { status: 400 }
      )
    }

    await db.query(`DELETE FROM Likes WHERE user_id = ? AND blog_post_id = ?`, [
      user_id,
      blog_post_id,
    ])

    await db.query(`UPDATE BlogPosts SET likes = likes - 1 WHERE id = ?`, [
      blog_post_id,
    ])

    return NextResponse.json(
      { message: 'Post unliked successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error unliking post:', error)
    return NextResponse.json({ error: 'Error unliking post' }, { status: 500 })
  }
}
