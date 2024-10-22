// import { compare } from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { db } from '../../../../utils/db'
// import { NextResponse } from 'next/server'

// export async function POST(request) {
//   try {
//     const { email, password } = await request.json()

//     console.log('Email:', email)
//     console.log('Password:', password)

//     const users = await db.query('SELECT * FROM Users WHERE email = ?', [email])
//     if (users[0].length === 0) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 })
//     }

//     const user = users[0]

//     // Check user is verified or not
//     console.log(user[0].isVerified)
//     if (!user[0].isVerified) {
//       return NextResponse.json(
//         { message: 'This user is not verified!' },
//         { status: 404 }
//       )
//     }

//     // Check password
//     const isMatch = await compare(password, user[0].password)
//     if (!isMatch) {
//       return NextResponse.json(
//         { message: 'Incorrect password' },
//         { status: 401 }
//       )
//     }

//     console.log(isMatch)

//     // Create JWT token
//     const token = jwt.sign(
//       { userId: user[0].id, role: user[0].role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: '1h',
//       }
//     )

//     return NextResponse.json({ token, user }, { status: 200 })
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({ message: 'Error logging in' }, { status: 500 })
//   }
// }

import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../../../../utils/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Fetch user by email
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [
      email,
    ])
    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const user = users[0]

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: 'This user is not verified!' },
        { status: 403 }
      )
    }

    // Check if the password is correct
    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Set token in httpOnly cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        },
      },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 60,
      // maxAge: 2,
    })

    return response
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 })
  }
}
