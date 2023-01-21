import {
  defaultHappyResponse,
  sendBaseResponse
} from '../../middlewares/api-utils'
import {
  generateRefreshToken,
  generateAccessToken
} from '../../auth/util/verifyers'
import { JWTPayload } from '../../types'
import { Request, Response } from 'express'

export const refreshToken = (req: Request, res: Response) => {
  const userId = (req.user as JWTPayload).userId

  res.cookie('jid', generateRefreshToken(userId))

  sendBaseResponse(
    defaultHappyResponse({
      data: {
        accessToken: generateAccessToken(userId)
      },
      message: 'Successfully updated the access token'
    }),
    res
  )
}
