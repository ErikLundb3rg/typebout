import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import {
  generateRefreshToken,
  generateAccessToken
} from '../../auth/util/verifyers'
import { JWTPayload } from '../../types'
import { Request, Response } from 'express'

export const refreshToken = (req: Request, res: Response) => {
  const userId = String((req.user as JWTPayload).userId)

  res.cookie('jid', generateRefreshToken(userId))

  return defaultHappyResponse({
    data: {
      accessToken: generateAccessToken(userId)
    },
    message: 'Successfully updated the access token'
  })
}
