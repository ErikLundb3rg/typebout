import { Socket } from 'socket.io'
import { createRoomHandler, joinRoomHandler } from './handlers'

export const onConnection = (socket: Socket) => {
  console.log('user connected')

  socket.on('createRoom', createRoomHandler(socket))
  socket.on('joinRoom', joinRoomHandler(socket))

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}
