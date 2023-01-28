import { Player } from '@/types'
import { keys } from '@/util/localstoragekeys'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from './types'

export const createSocket = (user: Player, isGuest: boolean) => {
  const token = localStorage.getItem(keys.accessToken)
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1400',
    {
      auth: {
        accessToken: token,
        user,
        isGuest
      }
    }
  )
  return socket
}
