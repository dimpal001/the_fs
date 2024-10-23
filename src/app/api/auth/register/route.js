import { hash } from 'bcryptjs'
import { db } from '../../../../utils/db'
import { NextResponse } from 'next/server'
import { sendOtp } from '@/utils/sendOtp'

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST endpoint for registration
export async function POST(request) {
  try {
    const { email, password, role = 'guest' } = await request.json()

    const hashedPassword = await hash(password, 10)

    // Check if the user exists
    const [users] = await db.query(
      'SELECT email, isVerified FROM Users WHERE email = ?',
      [email]
    )

    if (users.length > 0) {
      const user = users[0]

      // If the user is verified, return an error
      if (user.isVerified) {
        return NextResponse.json(
          { message: 'Email address already exists and is verified.' },
          { status: 400 }
        )
      }

      // If the user is not verified, update the existing data
      const otp = generateOTP()
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000)

      await db.query(
        'UPDATE Users SET password = ?, role = ?, otp = ?, otp_expiration = ? WHERE email = ?',
        [hashedPassword, role, otp, expirationTime, email]
      )

      await sendOtp(email, otp)

      return NextResponse.json(
        {
          message:
            'User already exists but was not verified. A new OTP has been sent to your email.',
        },
        { status: 200 }
      )
    }

    // If the user doesn't exist, register a new user
    const otp = generateOTP()
    await db.query(
      'INSERT INTO Users (email, password, role, otp, isVerified) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, role, otp, 0]
    )

    await sendOtp(email, otp)

    return NextResponse.json(
      {
        message:
          'User registered successfully. Please check your email for the OTP.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { message: 'Error registering user', error },
      { status: 500 }
    )
  }
}
