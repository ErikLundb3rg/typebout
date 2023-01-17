import { Router } from 'express'
import { asyncHandler } from '../middlewares/api-utils'
import { login, register, logout } from '../controllers/user'

const router = Router()

router.post('/register', asyncHandler(register))

router.post('/login', asyncHandler(login))

router.post('/logout', asyncHandler(logout))

export default router
