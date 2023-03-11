import jwt from 'jsonwebtoken'
import { Users } from '@prisma/client'
export interface JWTPayload {
  userId: number
  username: string
  createdAt: Date
}

export const generateAccessToken = (user: Users) => {
  const { id, username, createdAt } = user
  const payload: JWTPayload = {
    userId: id,
    username,
    createdAt
  }
  return jwt.sign(
    { ...payload },
    process.env.PRIVATE_KEY_JWT_ACCESS as string,
    {
      expiresIn: '1m'
    }
  )
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.PRIVATE_KEY_JWT_REFRESH as string, {
    expiresIn: '7d'
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.PRIVATE_KEY_JWT_ACCESS as string)
}
