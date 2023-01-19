import { Router } from 'express'
import { asyncHandler } from '../middlewares/api-utils'
import { login, register, logout, refreshToken } from '../controllers/user'

const router = Router()

router.post('/register', asyncHandler(register))

router.post('/login', asyncHandler(login))

router.post('/logout', asyncHandler(logout))

router.post('/refreshToken', refreshToken)

export default router
