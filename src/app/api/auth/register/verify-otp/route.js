import { db } from '../../../../../utils/db'
import { NextResponse } from 'next/server'

// POST endpoint for verifying OTP
export async function POST(request) {
  try {
    const body = await request.json()

    const { email, userInputOTP } = body

    const [user] = await db.query('SELECT * FROM Users WHERE email = ?', [
      email,
    ])

    if (user.length === 0 || user[0].otp !== userInputOTP) {
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 })
    }

    if (!user || new Date(user.otp_expiration) < new Date()) {
      return NextResponse.json({ message: 'Expired OTP' }, { status: 400 })
    }

    await db.query(
      'UPDATE Users SET isVerified = ?, otp = NULL WHERE email = ?',
      [true, email]
    )

    return NextResponse.json(
      { message: 'Email verified successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { message: 'Error verifying OTP', error },
      { status: 500 }
    )
  }
}
