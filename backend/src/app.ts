import express from 'express'
import bodyParser from 'body-parser'
import { addRoutes } from './routes'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { errorHandlingMiddleWare } from './middlewares/error'
import { defaultLimiter } from './middlewares/rate-limit'
import cors from 'cors'
import helmet from 'helmet'

export const setupServer= (port: string | number) => {
  const app = express()

  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN! 
    })
  )

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(defaultLimiter)

  addRoutes(app)
  app.use(errorHandlingMiddleWare)

  return app
}
