import { Socket } from 'socket.io'
import roomDirector from '../roomDirector'

export const createRoomHandler = (socket: Socket) => {
  return () => {
    console.log('Creating room...')
    roomDirector.createRoom(socket)
  }
}
