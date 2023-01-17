import dotenv from 'dotenv'
import { initalizePassportStrategies } from './auth/strategies'
import app from './app'

const bootServer = (port: string | number) => {
  dotenv.config()
  initalizePassportStrategies()

  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
  })
}

const port = process.env.EXPRESS_PORT || 1337

bootServer(port)
