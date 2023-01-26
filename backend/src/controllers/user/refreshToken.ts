import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse,
  sendBaseResponse
} from '../../middlewares/api-utils'
import {
  generateRefreshToken,
  generateAccessToken
} from '../../auth/util/verifyers'
import { JWTPayload } from '../../types'
import { getUserById } from '../../dal/user'
import { BaseError } from '../../utils/error'
import { errorCodes } from '../../utils/error-codes'

export const refreshToken: AsyncController<Record<string, never>> = async (
  req,
  res
) => {
  const userId = (req.user as JWTPayload).userId

  res.cookie('jid', generateRefreshToken(userId))
  const user = await getUserById(userId)

  if (!user) {
    throw new BaseError(
      errorCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong',
      'Refresh token userId did not give user'
    )
  }

  return defaultHappyResponse({
    data: {
      accessToken: generateAccessToken(user)
    },
    message: 'Successfully updated the access token'
  })
}
