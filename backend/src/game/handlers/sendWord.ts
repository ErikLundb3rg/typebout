import { TypeBoutSocket, ClientToServerEvents } from '../types'

export const sendWordHandler = (
  socket: TypeBoutSocket
): ClientToServerEvents['sendWord'] => {
  return (word, mistakesObj) => {
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

    mistakesObj && personalGame.setMistakes(mistakesObj)
    personalGame.receiveWord(word)
  }
}
