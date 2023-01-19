import { Router } from 'express'
import { asyncHandler } from '../middlewares/api-utils'
import { login, register, logout, refreshToken } from '../controllers/user'
import passport from 'passport'

const router = Router()

router.post('/register', asyncHandler(register))

router.post('/login', asyncHandler(login))

router.post('/logout', asyncHandler(logout))

router.post(
  '/refreshToken',
  passport.authenticate('jwt', { session: false }),
  refreshToken
)

router.post(
  '/onlyauth',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.send('Authenticated')
  }
)

export default router
