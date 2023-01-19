import express from 'express'
import bodyParser from 'body-parser'
import { addRoutes } from './routes'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { errorHandlingMiddleWare } from './middlewares/error'
import cors from 'cors'

const buildApp = () => {
  const app = express()

  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(cors())

  addRoutes(app)
  app.use(errorHandlingMiddleWare)

  return app
}

export default buildApp()
