import dotenv from 'dotenv'
import { initalizePassportStrategies } from './auth/strategies'
import { bootServer } from './app'
import { bootSocketIO } from './socket'

const setup = () => {
  dotenv.config()
  initalizePassportStrategies()
}

const initialize = () => {
  // Needs to be run first as it initalizes environment variables and such
  setup()

  const expressPort = process.env.EXPRESS_PORT || 1337
  const socketIOPort = Number(process.env.SOCKET_PORT) || 1400

  bootServer(expressPort)
  bootSocketIO(socketIOPort)
}

initialize()
