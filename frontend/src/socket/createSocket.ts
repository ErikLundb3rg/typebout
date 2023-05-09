import { Player } from '@/socket/types'
import { keys } from '@/util/localstoragekeys'
import { io } from 'socket.io-client'
import { TypeBoutSocket } from './types'
import { refreshToken } from '@/apicalls'

export const createSocket = async (user: Player) => {
  if (!user.isGuest) {
    try {
      const res = await refreshToken()
      const { accessToken } = res.data.data
      localStorage.setItem(keys.accessToken, accessToken)
    } catch (error) {
      localStorage.removeItem(keys.accessToken)
      localStorage.removeItem(keys.user)
      location.href = '/users/login'
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
