import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getUserByUsername } from '../../dal/user'
import bcrypt from 'bcrypt'
import {
  generateRefreshToken,
  generateAccessToken
} from '../../auth/util/verifyers'

interface LoginProps {
  username: string
  password: string
}

export const login: AsyncController<LoginProps> = async (req, res) => {
  const { username, password } = req.body

  const user = await getUserByUsername(username)

  if (!user) {
    return defaultErrorResponse({
      message: 'Could not find a user with that username or password',
      status: 401
    })
  }

  const { password: hashedPassword } = user

  const result = await bcrypt.compare(password, hashedPassword)

  if (!result) {
    return defaultErrorResponse({
      message: 'Could not find a user with that username or password',
      status: 401
    })
  }

  res.cookie('jid', generateRefreshToken(username), { httpOnly: true })

  return defaultHappyResponse({
    data: {
      accessToken: generateAccessToken(username)
    },
    message: 'Successful Login'
  })
}
