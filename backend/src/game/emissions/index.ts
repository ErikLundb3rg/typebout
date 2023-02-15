import type { Room } from '../logic/roomDirector'
import type { Group } from '../logic/gameDirector'
import { TypeBoutSocket } from '../types'
import { Quotes } from '@prisma/client'

// Laughable:
const toSockets = (
  sockets: TypeBoutSocket[],
  callback: (socket: TypeBoutSocket) => void
) => {
  sockets.forEach((socket) => {
    callback(socket)
  })
}

export const sendRoomInfo = (room: Room) => {
  const roomInfo = room.getInformation()

  toSockets(room.users, (user) => {
    user.emit('roomInfo', roomInfo)
  })
}

// This is very ugly but I do can't come
// up with a better way to do this
export const sendCountDown = (
  count: number,
  group: Group,
  onFinished: () => void
) => {
  if (count <= 0) {
    throw new Error('Count cannot be less than 0')
  }
  const interval = setInterval(() => {
    toSockets(group.getSockets(), (socket) => {
      socket.emit('countdown', count)
    })
    if (count === 0) {
      clearInterval(interval)
      onFinished()
    }
    count -= 1
  }, 1000)
}

export const sendGameInfo = (group: Group) => {
  const gameInfo = group.gameInformation()
  toSockets(group.getSockets(), (user) => {
    user.emit('gameInfo', gameInfo)
  })
}

export const sendGameStart = (group: Group) => {
  toSockets(group.getSockets(), (user) => {
    user.emit('gameStarted')
  })
}

export const sendPrepareGame = (group: Group, quote: Quotes) => {
  toSockets(group.getSockets(), (user) => {
    user.emit('prepareGame', quote)
  })
}

export const sendEndGameStats = (group: Group) => {
  toSockets(group.getSockets(), (user) => {
    user.emit('completedStats', group.endGameStats())
  })
}
