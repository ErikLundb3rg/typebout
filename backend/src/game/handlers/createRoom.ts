import roomDirector from '../logic/roomDirector'
import { SocketHandler } from '../middlewares/handlerutils'
import { sendRoomInfo } from '../emissions'

const createLink = (roomId: string) => {
  return `http://localhost:3000/game/joinRoom?room=${roomId}`
}

export const createRoomHandler: SocketHandler<'createRoom'> = (socket) => {
  return (callback) => {
    console.log('Creating room...')
    const roomId = roomDirector.createRoom(socket)
    const room = roomDirector.getRoom(roomId)
    sendRoomInfo(room!)
    callback(createLink(roomId))
  }
}
