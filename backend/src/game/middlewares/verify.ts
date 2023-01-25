import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

// This middleware will check if the connecting
// client has the status of a logged in User
// or Guest, and load the socket.data property
// accordingly

type SocketIOMiddleWareHandler = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => void
export const verifyConnection: SocketIOMiddleWareHandler = (socket, next) => {
  const { handshake } = socket

  console.log('handshake', handshake)
  next()
}
