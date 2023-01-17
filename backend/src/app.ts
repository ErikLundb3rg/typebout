import express from 'express'
import bodyParser from 'body-parser'
import { addRoutes } from './routers'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { errorHandlingMiddleWare } from './middlewares/error'

const buildApp = () => {
  const app = express()

  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(passport.initialize())

  addRoutes(app)

  app.use(errorHandlingMiddleWare)

  return app
}

export default buildApp()
