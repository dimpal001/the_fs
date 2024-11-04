// middleware.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const protectedRoutes = ['/admin']

export function middleware(request) {
  const url = request.nextUrl.clone()
  const token = request.cookies.get('token')

  console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname}`)

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', url.origin))
    }

    try {
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/login', url.origin))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
