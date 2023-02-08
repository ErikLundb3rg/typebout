import roomDirector from '../logic/roomDirector'
import { SocketHandler } from '../middlewares/handlerutils'
import { sendRoomInfo } from '../emissions'

export const joinRoomHandler: SocketHandler<'joinRoom'> = (socket) => {
  return (roomId, callback) => {
    const room = roomDirector.getRoom(roomId)
    console.log(`Socket joining: user: ${socket.data.username}`)

    if (!room) {
      callback(false)
      return
    }

    room.addUser(socket)
    sendRoomInfo(room)
    callback(true)
  }
}
