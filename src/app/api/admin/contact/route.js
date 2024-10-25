import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import bcrypt from 'bcryptjs'
import { sendSubscriptionEmail } from '@/utils/sendEmail'
import jwt from 'jsonwebtoken'

// New message
export async function POST(request) {
  try {
    const { name, email, message, is_subscribe } = await request.json()

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (is_subscribe) {
      // Check if the subscriber already exists
      const [existingSubscriber] = await db.query(
        `SELECT * FROM Subscribers WHERE email = ?`,
        [email]
      )

      if (existingSubscriber.length !== 0) {
        const result = await db.query(
          'INSERT INTO Subscribers (email) VALUES (?)',
          [email]
        )

        await sendSubscriptionEmail(email)
      }
    }

    // Insert the new message into the database
    await db.query(
      'INSERT INTO ContactUs (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    )

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error sending message' },
      { status: 500 }
    )
  }
}

// Get all messages
export async function GET(request) {
  // Authentication
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

  if (decoded.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized access!.' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit
  try {
    // Fetch all messages from the database
    const [messages] = await db.query(
      `SELECT id, name, email, message, submitted_at FROM ContactUs ORDER BY submitted_at DESC LIMIT ${limit} OFFSET ${offset}`
    )

    const [[{ totalMessages }]] = await db.query(
      `SELECT COUNT(*) as totalMessages FROM ContactUs`
    )
    const totalPages = Math.ceil(totalMessages / limit)

    return NextResponse.json(
      {
        messages,
        currentPage: page,
        totalPages: totalPages,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching messages' },
      { status: 500 }
    )
  }
}

// Delete a message
export async function DELETE(request) {
  // Authentication
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

  if (decoded.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized access!.' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (!id) {
      return NextResponse.json(
        { message: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Delete the message from the database
    await db.query(`DELETE FROM ContactUs WHERE id = ?`, [id])

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting message' },
      { status: 500 }
    )
  }
}
