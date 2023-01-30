import { Player } from '@/socket/types'
import { keys } from '@/util/localstoragekeys'
import { io, Socket } from 'socket.io-client'
import { TypeBoutSocket } from './types'

export const createSocket = (user: Player, isGuest: boolean) => {
  // TODO: We should refresh tokens here as this is the only time
  // we authenticate the user from the socket server.
  const token = localStorage.getItem(keys.accessToken)
  const socket: TypeBoutSocket = io(
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
