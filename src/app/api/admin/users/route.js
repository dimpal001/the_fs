import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import bcrypt from 'bcryptjs'

// Get all users or a specific user by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    if (id) {
      const [users] = await db.query('SELECT * FROM Users WHERE id = ?', [id])
      if (users.length === 0) {
        return NextResponse.json(
          { message: 'Users not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(users[0], { status: 200 })
    } else {
      // Count total users
      const [[{ totalUsers }]] = await db.query(
        `SELECT COUNT(*) as totalUsers FROM Users`
      )
      const totalPages = Math.ceil(totalUsers / limit)

      const [users] = await db.query(
        `SELECT * FROM Users  ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
      )
      return NextResponse.json(
        {
          users,
          current_page: page,
          total_pages: totalPages,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error fetching Users' },
      { status: 500 }
    )
  }
}

// Update user details
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, name, oldPassword, newPassword } = body

    console.log(id)
    console.log(oldPassword)
    console.log(newPassword)

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const [user] = await db.query('SELECT * FROM Users WHERE id = ?', [id])
    if (!user || user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (name) {
      await db.query('UPDATE Users SET name = ? WHERE id = ?', [name, id])
    }

    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { message: 'Old password is required to update the password' },
          { status: 400 }
        )
      }

      const passwordMatch = await bcrypt.compare(oldPassword, user.password)

      if (!passwordMatch) {
        return NextResponse.json(
          { message: 'Old password is incorrect' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updateFields.password = hashedPassword
    }

    const [userData] = await db.query('SELECT * FROM Users WHERE id = ?', [id])

    return NextResponse.json(
      userData,
      { message: 'User updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    )
  }
}
