import { Socket } from 'socket.io'
import {
  createRoomHandler,
  joinRoomHandler,
  disconnectHandler,
  startGameHandler
} from './handlers'

export const onConnection = (socket: Socket) => {
  console.log('user connected')

  socket.on('createRoom', createRoomHandler(socket))
  socket.on('joinRoom', joinRoomHandler(socket))
  socket.on('startGame', startGameHandler(socket))

  socket.on('disconnect', disconnectHandler(socket))
}
