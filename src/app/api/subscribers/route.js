import { NextResponse } from 'next/server'
import { db } from '../../../utils/db'
import { sendSubscriptionEmail } from '@/utils/sendEmail'

// POST - Add Subscribers
export async function POST(request) {
  const body = await request.json()

  try {
    const { email } = body
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if the subscriber already exists
    const [existingSubscriber] = await db.query(
      `SELECT * FROM Subscribers WHERE email = ?`,
      [email]
    )

    if (existingSubscriber.length > 0) {
      // If subscriber exists, return an error message
      return NextResponse.json(
        { message: 'Subscriber already exists' },
        { status: 409 }
      )
    }

    // If not existing, insert the new subscriber
    const result = await db.query(
      'INSERT INTO Subscribers (email) VALUES (?)',
      [email]
    )

    // Send subscription email
    await sendSubscriptionEmail(email)

    return NextResponse.json(
      { message: 'Subscriber added successfully', id: result.insertId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating subscriber:', error)
    return NextResponse.json(
      { error: 'Error creating subscriber' },
      { status: 500 }
    )
  }
}

// GET - All Subscribers
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit

  try {
    // Count total users
    const [[{ totalSubscribers }]] = await db.query(
      `SELECT COUNT(*) as totalSubscribers FROM Subscribers`
    )

    const totalPages = Math.ceil(totalSubscribers / limit)

    const [subscribers] = await db.query(
      `SELECT * FROM Subscribers LIMIT ${limit} OFFSET ${offset}`
    )
    return NextResponse.json(
      { subscribers, current_page: page, total_pages: totalPages },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Error fetching subscribers' },
      { status: 500 }
    )
  }
}
