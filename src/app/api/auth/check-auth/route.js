// /api/auth/check-auth.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  const token = request.cookies.get('token')
  console.log(token)

  if (!token) {
    return NextResponse.json(
      { message: 'Session expired! Login again.', isAuthenticated: false },
      { status: 401 }
    )
  }

  console.log(Date.now(), ' : Now')
  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)
  console.log(decoded.exp * 1000, ' : Expire')

  try {
    // Verify the token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

    // Check if the token is expired
    const isExpired = Date.now() >= decoded.exp * 1000
    if (isExpired) {
      return NextResponse.json(
        { message: 'Session expired! Login again.', isAuthenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({ isAuthenticated: true, userId: decoded.userId })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Access denied!', isAuthenticated: false },
      { status: 401 }
    )
  }
}
