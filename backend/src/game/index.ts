import { Socket } from 'socket.io'
import {
  createRoomHandler,
  joinRoomHandler,
  disconnectHandler,
  startGameHandler,
  sendWordHandler
} from './handlers'
import { ClientToServerEvents } from './types'
import { playAgainHandler } from './handlers/playAgain'

export const withErrorHandling = <T extends (...args: any) => any>(
  handler: T
) => {
  return (...xs: Parameters<T>) => {
    try {
      handler(...xs)
    } catch (error) {
      console.error('Socket error: ', error)
    }
  }
}

export const onConnection = (socket: Socket) => {
  socket.on(
    'createRoom',
    withErrorHandling<ClientToServerEvents['createRoom']>(
      createRoomHandler(socket)
    )
  )
  socket.on(
    'joinRoom',
    withErrorHandling<ClientToServerEvents['joinRoom']>(joinRoomHandler(socket))
  )
  socket.on(
    'startGame',
    withErrorHandling<ClientToServerEvents['startGame']>(
      startGameHandler(socket)
    )
  )
  socket.on(
    'playAgainGame',
    withErrorHandling<ClientToServerEvents['playAgainGame']>(
      playAgainHandler(socket)
    )
  )
  socket.on(
    'sendWord',
    withErrorHandling<ClientToServerEvents['sendWord']>(sendWordHandler(socket))
  )
  socket.on(
    'disconnect',
    withErrorHandling<() => void>(disconnectHandler(socket))
  )
}
