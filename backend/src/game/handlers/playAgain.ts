import { SocketHandler } from '../middlewares/handlerutils'
import games, { Group } from '../logic/gameDirector'
import {
  sendCountDown,
  sendGameInfo,
  sendGameStart,
  sendPrepareGame
} from '../emissions'
import { getRandomQuote } from '../../dal/quotes'
import { onFinish, sendGameInfoRepeatedly } from '../service/play'

export const playAgainHandler: SocketHandler<'playAgainGame'> = (socket) => {
  return async () => {
    const { roomID, group } = socket.data

    if (roomID === null || roomID === undefined) {
      console.error('Cannot start game with this user as it is not in a room')
      return
    }

    if (group === null || group === undefined) {
      console.error('Cannot start game without group')
      return
    }

    const users = group.personalGames.map((game) => game.user)

    const quote = await getRandomQuote()
    const newGroup = Group.fromUsers(
      group.personalGames.map((game) => game.user),
      quote,
      onFinish
    )
    games.addGroup(newGroup, roomID)

    newGroup.personalGames.forEach((personalGame) => {
      personalGame.user.data.group = newGroup
      personalGame.user.data.personalGame = personalGame
    })

    const { author, content } = quote
    sendPrepareGame(newGroup, { content, author: author.name })

    sendGameInfo(newGroup)
    sendCountDown(5, newGroup, () => {
      newGroup.startGames()
      sendGameInfoRepeatedly(newGroup, 500, 140)
      sendGameStart(newGroup)
    })
  }
}
