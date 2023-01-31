import { TypeBoutSocket } from '../types'
import roomDirector from '../roomDirector'
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
      throw new Error('We could not find the room from attached roomID')
    }

    room.removeUser(socket)

    // Update other connected users about the condition of the room
    sendRoomInfo(room)
  }
}
