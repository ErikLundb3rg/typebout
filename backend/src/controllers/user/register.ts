import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { registerUser, getUserByUsername } from '../../dal/user'
import bcrypt from 'bcrypt'
import { errorCodes } from '../../utils/error-codes'
import Joi from 'joi'

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

export const register: AsyncController<RegisterProps> = async (req) => {
  const { error, value } = registerSchema.validate(req.body)

  if (error) {
    return defaultErrorResponse({
      data: {
        errors: transformError(error)
      },
      status: errorCodes.BAD_REQUEST
    })
  }

  const { username, password } = req.body

  if (await userExists(username)) {
    const errors: RegisterProps = {
      username: 'A user with this username already exists',
      password: '',
      confirmPassword: ''
    }
    return defaultErrorResponse({
      data: {
        errors
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

    return defaultHappyResponse({
      data: user,
      message: 'User signup was successful'
    })
  } catch (error) {
    return defaultErrorResponse({
      message: 'Something went wrong',
      status: errorCodes.INTERNAL_SERVER_ERROR
    })
  }
}
