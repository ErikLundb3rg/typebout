import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { verifyAccessToken } from '../util/verifyers'

interface JWTPayload {
  userID: number
}

export const initializeBearerStrategy = () => {
  passport.use(
    new BearerStrategy((token, done) => {
      try {
        const payload = verifyAccessToken(token) as JWTPayload
        console.log('payload', payload)
        return done(null, payload)
      } catch (e) {
        return done('Unauthorized', null)
      }
    })
  )
}
