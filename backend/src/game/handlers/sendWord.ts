import { TypeBoutSocket } from '../types'
import { sendGameInfo } from '../emissions'

export const sendWordHandler = (socket: TypeBoutSocket) => {
  return (word: string) => {
    const { group, personalGame } = socket.data

    console.log(
      personalGame,
      group,
      group?.started,
      personalGame?.hasFinished()
    )
    if (
      !personalGame ||
      !group ||
      !group.started ||
      personalGame.hasFinished()
    ) {
      console.error(
        'Personalgame, group not defined, has not started or has already finished'
      )
      return
    }

    personalGame.receiveWord(word)
    sendGameInfo(group)
  }
}
