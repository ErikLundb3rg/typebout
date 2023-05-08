import dotenv from 'dotenv'
import { initalizePassportStrategies } from './auth/strategies'
import { setupServer } from './app'
import { bootSocketIO } from './socket'
import http from 'http'

const setup = () => {
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
  }
  initalizePassportStrategies()
}

const initialize = () => {
  // Needs to be run first as it initalizes environment variables and such
  setup()
  console.log('Server running in mode:', process.env.MODE)

  const port = process.env.SERVER_PORT || 1337

  const expressApp = setupServer(port)
  const httpServer = http.createServer(expressApp)
  bootSocketIO(httpServer, Number(port))

  httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

initialize()
