import type { Room } from '../roomDirector'

export const sendRoomInfo = (room: Room) => {
  const roomInfo = room.getInformation()

  room.getUsers().forEach((user) => {
    user.emit('roomInfo', roomInfo)
  })
}
