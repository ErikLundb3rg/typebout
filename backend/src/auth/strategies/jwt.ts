import passport from 'passport';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { Request } from 'express';

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    const jwt = req.cookies['jid'];
    console.log('jwt', jwt);
    return jwt;
  }
  return null;
};

export const initializeJWTStrategy = () => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.PRIVATE_KEY_JWT_REFRESH
      },
      (payload, done) => {
        const { expiration } = payload;

        if (Date.now() > expiration) {
          done('Expired token', false);
        }
        done(null, payload);
      }
    )
  );
};