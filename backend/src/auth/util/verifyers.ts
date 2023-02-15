import jwt from 'jsonwebtoken'
import { Users } from '@prisma/client'

export const generateAccessToken = (user: Users) => {
  const { id, username, createdAt } = user
  return jwt.sign(
    {
      id,
      username,
      createdAt
    },
    process.env.PRIVATE_KEY_JWT_ACCESS as string,
    {
      expiresIn: '15s'
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
