import jwt from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'

export const hashPassword = async (password) => {
  return await hash(password, 10)
}

export const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword)
}

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
