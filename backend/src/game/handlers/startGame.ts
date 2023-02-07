import { SocketHandler } from '../middlewares/handlerutils'
import roomDirector from '../logic/roomDirector'
import games, { Group } from '../logic/gameDirector'
import { sendCountDown, sendGameStart, sendPrepareGame } from '../emissions'
import { Quote } from '../types/index'

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

    if (room.admin !== socket) {
      console.error(
        'User who is not admin of the room is trying to start the game'
      )
      return
    }

    const users = room.users
    roomDirector.removeRoom(roomID)

    const quote: Quote = {
      content: 'Please type this out. Hi ho ha ha',
      author: 'author name'
    }

    const group = Group.fromUsers(users, quote)
    games.addGroup(group, room.id)

    group.personalGames.forEach((personalGame) => {
      personalGame.user.data.group = group
      personalGame.user.data.personalGame = personalGame
    })

    sendPrepareGame(group, quote)

    sendCountDown(5, group, () => {
      group.startGames()
      sendGameStart(group)
    })
  }
}
