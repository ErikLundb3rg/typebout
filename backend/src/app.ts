import express from 'express'
import bodyParser from 'body-parser'
import { addRoutes } from './routes'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { errorHandlingMiddleWare } from './middlewares/error'
import cors from 'cors'

export const bootServer = (port: string | number) => {
  const app = express()

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000'
    })
  )
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(passport.initialize())

  addRoutes(app)
  app.use(errorHandlingMiddleWare)

  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
  })
}
