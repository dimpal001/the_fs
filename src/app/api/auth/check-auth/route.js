// /api/auth/check-auth.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  // Retrieve the token from cookies
  const token = request.cookies.get('token')

  // If no token is present, send an unauthorized response
  if (!token) {
    return NextResponse.json(
      { message: 'Session expired! Login again.', isAuthenticated: false },
      { status: 401 }
    )
  }

  try {
    // Verify and decode the token using the secret key
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

    // Check if the token has expired
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json(
        { message: 'Session expired! Login again.', isAuthenticated: false },
        { status: 401 }
      )
    }

    // If the token is valid and not expired, return a successful response with user ID
    return NextResponse.json({ isAuthenticated: true, userId: decoded.userId })
  } catch (error) {
    console.error('Error during token verification:', error)

    // Handle cases where the token verification fails due to invalid signature, expiration, etc.
    return NextResponse.json(
      { message: 'Access denied!', isAuthenticated: false },
      { status: 401 }
    )
  }
}
