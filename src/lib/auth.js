import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function verifyAdmin(req, res) {
  const token = JSON.parse(localStorage.getItem('token'))

  if (!token) {
    return { isAuthenticated: false }
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)

    if (user && user.role === 'admin') {
      return { isAuthenticated: true, user }
    } else {
      return { isAuthenticated: false }
    }
  } catch (error) {
    return { isAuthenticated: false }
  }
}
