import roomDirector from '../roomDirector'
import { SocketHandler } from '../middlewares/handlerutils'

export const joinRoomHandler: SocketHandler<'joinRoom'> = (socket) => {
  return (roomId, callback) => {
    const room = roomDirector.getRoom(roomId)

    if (!room) {
      callback(false)
      return
    }

    room.addUser(socket)
    socket.emit('roomInfo', room.getInformation())
    callback(true)
  }
}
