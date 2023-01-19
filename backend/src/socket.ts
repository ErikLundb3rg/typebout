import { Server, Socket } from 'socket.io'
import { Application } from 'express'
import { createRoomHandler } from './game/handlers'
import http from 'http'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServerToClientEvents {}

interface ClientToServerEvents {
  createRoom: () => void
}

interface SocketData {
  username: string
  isGuest: boolean
}

const onConnection = (socket: Socket) => {
  console.log('user connected')

  socket.on('createRoom', createRoomHandler(socket))

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}

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

  io.on('connection', onConnection)

  io.listen(socketPort)
}
