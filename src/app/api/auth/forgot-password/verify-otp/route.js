import { hash } from 'bcryptjs'
import { db } from '../../../../../utils/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json()

    const [user] = await db.query(
      'SELECT * FROM Users WHERE email = ? AND otp = ?',
      [email, otp]
    )

    if (user.length === 0 || user[0].otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 })
    }

    if (!user || new Date(user.otp_expiration) < new Date()) {
      return NextResponse.json({ message: 'Expired OTP' }, { status: 400 })
    }

    const hashedPassword = await hash(newPassword, 10)

    await db.query(
      'UPDATE Users SET password = ?, otp = NULL, otp_expiration = NULL WHERE email = ?',
      [hashedPassword, email]
    )

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error resetting password' },
      { status: 500 }
    )
  }
}
