import { Socket } from 'socket.io'
import { createRoomHandler } from './handlers'

export const onConnection = (socket: Socket) => {
  console.log('user connected')

  socket.on('createRoom', createRoomHandler(socket))

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}
