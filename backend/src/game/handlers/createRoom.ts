import { Socket } from 'socket.io'
import roomDirector from '../roomDirector'

export const createRoomHandler = (socket: Socket) => {
  return () => {
    roomDirector.createRoom(socket)
  }
}
