import { Server } from 'socket.io'
import { onConnection } from './game'
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
} from './game/types'
import { verifyConnection } from './game/middlewares/verify'

export const bootSocketIO = (httpServer: any, port: number) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
  >(httpServer,{

    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      credentials: true // Allow credentials
    }
  })

  io.use(verifyConnection)
  io.on('connection', onConnection)
  console.log(`Socket io server listening on ${port}`)
}
