import { Player } from '@/socket/types'
import { keys } from '@/util/localstoragekeys'
import { io } from 'socket.io-client'
import { TypeBoutSocket } from './types'
import { refreshToken } from '@/apicalls'
import { tryRefreshToken } from '@/util/auth'

export const createSocket = async (user: Player) => {
  if (!user.isGuest) {
    const hasRefreshed = await tryRefreshToken()

    if (!hasRefreshed) {
      return
    }
  }

  const accessToken = localStorage.getItem(keys.accessToken)

  const socket: TypeBoutSocket = io(
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337',
    {
      auth: {
        accessToken,
        user
      }
    }
  )
  return socket
}
