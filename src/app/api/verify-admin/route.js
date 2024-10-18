import { verifyAdmin } from '../../../lib/auth'

export async function GET(request) {
  const token = request.headers.authorization?.split(' ')[1]

  const { isAuthenticated, user } = verifyAdmin(token)

  if (isAuthenticated) {
    return NextResponse.json({ isAuthenticated: true, user }, { status: 200 })
  } else {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }
}
