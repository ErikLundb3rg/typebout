import { Socket } from 'socket.io'
import roomDirector from '../roomDirector'
import { ClientToServerEvents } from '../socketTypes'

const createLink = (roomId: number) => {
  return `http://localhost:3000/game/join/${roomId}`
}

export const createRoomHandler = (
  socket: Socket
): ClientToServerEvents['createRoom'] => {
  return (callback) => {
    console.log('Creating room...')
    const roomId = roomDirector.createRoom(socket)
    callback(createLink(roomId))
  }
}
