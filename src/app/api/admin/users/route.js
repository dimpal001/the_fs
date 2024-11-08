import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import bcrypt from 'bcryptjs'

// Get all users or a specific user by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const searchQuery = searchParams.get('searchQuery')
    const activeUser = parseInt(searchParams.get('activeUser'))
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    console.log(searchParams)

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
      // Build the WHERE clauses conditionally
      const conditions = []
      const params = []

      // Filter by active status if `activeUser` is set
      if (!isNaN(activeUser)) {
        conditions.push('Users.is_active = ?')
        params.push(activeUser)
      }

      // Search by username or email if `searchQuery` is set
      if (searchQuery) {
        conditions.push('(Users.name LIKE ? OR Users.email LIKE ?)')
        params.push(`%${searchQuery}%`, `%${searchQuery}%`)
      }

      // Convert conditions to SQL
      const whereClause = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : ''

      // Count total users with the applied filters
      const [[{ totalUsers }]] = await db.query(
        `SELECT COUNT(*) as totalUsers FROM Users ${whereClause}`,
        params
      )
      const totalPages = Math.ceil(totalUsers / limit)

      const [users] = await db.query(
        `
        SELECT Users.*, COUNT(BlogPosts.id) as totalPosts 
        FROM Users
        LEFT JOIN BlogPosts ON BlogPosts.author_id = Users.id
        ${whereClause}
        GROUP BY Users.id
        ORDER BY Users.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
        `,
        [...params]
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
    console.log(error)
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

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // Delete the user from the database
    await db.query('DELETE FROM Likes WHERE user_id = ?', [id])
    const [result] = await db.query(`DELETE FROM Users WHERE id = ?`, [id])

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: 'User deleted successfully' },
        { status: 200 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    )
  }
}
