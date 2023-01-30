import { Server } from 'socket.io'
import { onConnection } from './game'
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
} from './game/types'
import { verifyConnection } from './game/middlewares/verify'

const LOCALHOST_URL = 'http://localhost:3000'

export const bootSocketIO = (socketPort: number) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
  >({
    cors: {
      origin: LOCALHOST_URL,
      methods: ['GET', 'POST']
    }
  })

  io.use(verifyConnection)
  io.on('connection', onConnection)

  io.listen(socketPort)
}
