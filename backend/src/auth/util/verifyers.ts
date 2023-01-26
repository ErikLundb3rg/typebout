import jwt from 'jsonwebtoken'
import { Users } from '@prisma/client'

export const generateAccessToken = (user: Users) => {
  return jwt.sign(user, process.env.PRIVATE_KEY_JWT_ACCESS as string, {
    expiresIn: '50d'
  })
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.PRIVATE_KEY_JWT_REFRESH as string, {
    expiresIn: '10d'
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.PRIVATE_KEY_JWT_ACCESS as string)
}
