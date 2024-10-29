// /api/auth/check-auth.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Retrieve the token from cookies
  const token = request.cookies.get('token')
  // If no token is present, send an unauthorized response
  try {
    if (!token) {
      return NextResponse.json(
        { message: 'Session expired! Login again.', isAuthenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({ isAuthenticated: true })
  } catch (error) {
    console.log(error)
    // Handle cases where the token verification fails due to invalid signature, expiration, etc.
    return NextResponse.json(
      { message: 'Access denied!', isAuthenticated: false },
      { status: 401 }
    )
  }
}
