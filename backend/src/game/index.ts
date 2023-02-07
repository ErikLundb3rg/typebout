import { Socket } from 'socket.io'
import {
  createRoomHandler,
  joinRoomHandler,
  disconnectHandler,
  startGameHandler,
  sendWordHandler
} from './handlers'

export const onConnection = (socket: Socket) => {
  console.log('user connected')

  socket.on('createRoom', createRoomHandler(socket))
  socket.on('joinRoom', joinRoomHandler(socket))
  socket.on('startGame', startGameHandler(socket))
  socket.on('sendWord', sendWordHandler(socket))

  socket.on('disconnect', disconnectHandler(socket))
}
