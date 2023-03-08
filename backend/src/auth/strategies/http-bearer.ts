import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { verifyAccessToken } from '../util/verifyers'

// This is used to verify access token, which is passed
// in the request body
// https://github.com/jaredhanson/passport-http-bearer

// Pass token in header request as
// Authorization: Bearer eyJhbGciOiJ...
export const initializeBearerStrategy = () => {
  passport.use(
    new BearerStrategy((token, done) => {
      try {
        const payload = verifyAccessToken(token)
        return done(null, payload)
      } catch (e) {
        return done('Unauthorized', null)
      }
    })
  )
}
