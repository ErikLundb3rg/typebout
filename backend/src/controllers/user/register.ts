import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { registerUser, getUserByUsername } from '../../dal/user'
import bcrypt from 'bcrypt'
import { errorCodes } from '../../constants/error-codes'
import Joi from 'joi'
import { profanitiesSet } from '../../constants/profanities'
import { trimStringRecord } from '../../utils/trim'
import {
  generateRefreshToken,
  generateAccessToken
} from '../../auth/util/verifyers'

interface RegisterProps {
  username: string
  password: string
  confirmPassword: string
}

const userExists = async (username: string) => {
  const user = await getUserByUsername(username)
  return user && true
}

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{7,30}$'))
    .required()
    .messages({
      'string.pattern.base': `Password should be between 7 to 30 characters and contain letters or numbers only`,
      'string.empty': `Password cannot be empty`,
      'any.required': `Password is required`
    }),

  confirmPassword: Joi.any().equal(Joi.ref('password')).messages({
    'any.only': 'Confirm password does not match password',
    'any.required': 'Please re-enter the password'
  })
})

const transformError = (error: Joi.ValidationError) => {
  const errors: RegisterProps = {
    username: '',
    password: '',
    confirmPassword: ''
  }
  error.details.forEach((detail) => {
    const { message, context } = detail
    if (context && context.key) {
      const { key } = context
      errors[key as keyof RegisterProps] = message
    }
  })
  return errors
}

export const register: AsyncController<RegisterProps> = async (req, res) => {
  const body = trimStringRecord({ ...req.body })
  const { error, value } = registerSchema.validate(body)
  console.log('value', value)

  if (error) {
    return defaultErrorResponse({
      data: {
        errors: transformError(error)
      },
      status: errorCodes.BAD_REQUEST
    })
  }

  const { username, password } = body

  if (profanitiesSet.has(username)) {
    return defaultErrorResponse({
      data: {
        errors: {
          username: 'Please pick a username which is less profane'
        },
        status: errorCodes.BAD_REQUEST
      }
    })
  }

  if (await userExists(username)) {
    return defaultErrorResponse({
      data: {
        errors: {
          username: 'A user with this username already exists'
        }
      },
      status: errorCodes.BAD_REQUEST
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    )

    const user = await registerUser({
      username,
      password: hashedPassword
    })

    res.cookie('jid', generateRefreshToken(user.id), { httpOnly: true })

    return defaultHappyResponse({
      data: {
        user,
        accessToken: generateAccessToken(user)
      },
      message: 'User signup was successful'
    })
  } catch (error) {
    console.log(error)
    return defaultErrorResponse({
      message: 'Something went wrong',
      status: errorCodes.INTERNAL_SERVER_ERROR
    })
  }
}
