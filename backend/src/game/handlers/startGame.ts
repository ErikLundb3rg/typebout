import { SocketHandler } from '../middlewares/handlerutils'
import roomDirector from '../logic/roomDirector'
import { GameGroup } from '../logic/gameDirector'

// Here we move the users connected to the room
// from the roomDirector to the game logic classes
// why? abstraction?
export const startGameHandler: SocketHandler<'startGame'> = (socket) => {
  return () => {
    const { roomID } = socket.data

    if (roomID === null || roomID === undefined) {
      console.error('Cannot start game with this user as it is not in a room')
      return
    }

    const room = roomDirector.getRoom(roomID)

    if (!room) {
      console.error('Could not find room with roomID:', roomID)
      return
    }

    const users = room.getUsers()
    roomDirector.removeRoom(roomID)
  }
}
