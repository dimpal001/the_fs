// middleware.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const protectedRoutes = ['/admin', '/api/admin']

export function middleware(request) {
  const url = request.nextUrl.clone()
  const token = request.cookies.get('token')

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', url.origin))
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

      return NextResponse.next()
    } catch (error) {
      console.error('Invalid token:', error)
      return NextResponse.redirect(new URL('/login', url.origin))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
