import { TypeBoutSocket } from '../types'
import roomDirector from '../logic/roomDirector'
import { sendRoomInfo } from '../emissions'

// When a sockets disconnect we should:
// 1) Disconnect the user from its current lobby / room
export const disconnectHandler = (socket: TypeBoutSocket) => {
  return () => {
    const { roomID } = socket.data

    if (roomID === undefined || roomID === null) {
      console.log(`User: ${socket.data.username} was not connected to a room`)
      return
    }

    const room = roomDirector.getRoom(roomID)

    if (!room) {
      return
    }

    room.removeUser(socket)

    if (room.isEmpty()) {
      roomDirector.removeRoom(roomID)
      return
    }

    // Update other connected users about the condition of the room
    sendRoomInfo(room)
  }
}
