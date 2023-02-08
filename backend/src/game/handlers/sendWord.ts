import { TypeBoutSocket } from '../types'

export const sendWordHandler = (socket: TypeBoutSocket) => {
  return (word: string) => {
    const { group, personalGame } = socket.data

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
  }
}
