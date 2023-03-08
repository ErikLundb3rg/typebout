import { Router } from 'express'
import { asyncHandler } from '../middlewares/api-utils'
import {
  login,
  register,
  logout,
  refreshToken,
  profile
} from '../controllers/user'
import passport from 'passport'

const router = Router()

router.post('/register', asyncHandler(register))

router.post('/login', asyncHandler(login))

router.post('/logout', asyncHandler(logout))

router.post(
  '/refreshToken',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(refreshToken)
)

router.post(
  '/onlyauth',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.send('Authenticated')
  }
)

router.get(
  '/profile',
  passport.authenticate('bearer', { session: false }),
  asyncHandler(profile)
)

export default router
