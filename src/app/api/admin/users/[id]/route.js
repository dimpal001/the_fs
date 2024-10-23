import { NextResponse } from 'next/server'
import { db } from '../../../../../utils/db'

// Get all users or a specific user by ID
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { is_active } = body

    const result = await db.query(
      'UPDATE Users SET is_active = ? WHERE id  = ?',
      [is_active, id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const [users] = await db.query('SELECT * FROM Users')
    return NextResponse.json(
      users,
      { message: 'User has been updated' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error fetching Users' },
      { status: 500 }
    )
  }
}
