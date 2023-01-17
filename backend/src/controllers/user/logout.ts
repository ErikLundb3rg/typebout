import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'

export const logout: AsyncController<Record<string, never>> = async (
  req,
  res
) => {
  if (req.cookies['jid']) {
    res.clearCookie('jid')
    return defaultHappyResponse({
      message: 'Successfully logged out'
    })
  }

  return defaultErrorResponse({
    message: 'Could not logout, perhaps you are not logged in?',
    status: 401
  })
}
