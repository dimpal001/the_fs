import { NextResponse } from 'next/server'
import { db } from '../../../utils/db'
import jwt from 'jsonwebtoken'

export async function PATCH(request) {
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

  try {
    const { data } = await request.json()

    console.log(data)

    await db.query('UPDATE PrivacyPolicy SET content = ? WHERE id = 1', [data])

    return NextResponse.json({ message: 'About us updated' }, { status: 200 })
  } catch (error) {
    console.error('Error updating data:', error)
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const [about] = await db.query('SELECT * FROM PrivacyPolicy WHERE id = 1')

    if (!about || about.length === 0) {
      return NextResponse.json({ error: 'About Us not found' }, { status: 404 })
    }

    return NextResponse.json(about[0], { status: 200 })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 })
  }
}
