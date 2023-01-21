import passport from 'passport'
import { Strategy as JWTStrategy } from 'passport-jwt'
import { Request } from 'express'

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    const jwt = req.cookies['jid']
    return jwt
  }
  return null
}

// This is used to verify refresh token, which is stored
// in an httponly cookie.
export const initializeJWTStrategy = () => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.PRIVATE_KEY_JWT_REFRESH
      },
      (payload, done) => {
        const { expiration } = payload
        if (Date.now() > expiration) {
          done('Expired token', false)
        }
        done(null, payload)
      }
    )
  )
}
