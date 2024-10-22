import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Get all users or a specific user by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    if (id) {
      // Authentication
      const token = request.cookies.get('token')
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const [users] = await db.query('SELECT * FROM Users WHERE id = ?', [id])
      if (users.length === 0) {
        return NextResponse.json(
          { message: 'Users not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(users[0], { status: 200 })
    } else {
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
  // Authentication
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { id, name, oldPassword, newPassword, image_url } = body

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

    if (image_url) {
      await db.query('UPDATE Users SET image_url = ? WHERE id = ?', [
        image_url,
        id,
      ])
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

// Delete user
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

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // Delete the user from the database
    await db.query('DELETE FROM Likes WHERE user_id = ?', [id])
    const [result] = await db.query(`DELETE FROM Users WHERE id = ?`, [id])

    console.log(result)
    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: 'User deleted successfully' },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    )
  }
}
