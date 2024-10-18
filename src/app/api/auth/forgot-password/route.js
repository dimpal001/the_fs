import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../../../../utils/db'
import { NextResponse } from 'next/server'
import { sendOtp } from '@/utils/sendOtp'

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const [user] = await db.query('SELECT * FROM Users WHERE email = ?', [
      email,
    ])

    if (user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const otp = generateOTP()
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000)

    await db.query(
      'UPDATE Users SET otp = ?, otp_expiration = ? WHERE email = ?',
      [otp, expirationTime, email]
    )

    await sendOtp(email, otp)

    return NextResponse.json(
      { message: 'OTP sent to your email' },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 })
  }
}
