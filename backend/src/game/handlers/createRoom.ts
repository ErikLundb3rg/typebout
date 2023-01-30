import roomDirector from '../roomDirector'
import { SocketHandler } from '../middlewares/handlerutils'
import { sendRoomInfo } from '../emissions'

const createLink = (roomId: number) => {
  return `http://localhost:3000/game/joinRoom?room=${roomId}`
}

export const createRoomHandler: SocketHandler<'createRoom'> = (socket) => {
  return (callback) => {
    console.log('Creating room...')
    console.log('socket data: ', socket.data)
    const roomId = roomDirector.createRoom(socket)
    const room = roomDirector.getRoom(roomId)
    sendRoomInfo(room!)
    callback(createLink(roomId))
  }
}
