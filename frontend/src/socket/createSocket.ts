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
      console.log('got new access token: ', accessToken)
      localStorage.setItem(keys.accessToken, accessToken)
    } catch (error) {
      console.log('failing refreshed tokens on createSocket')
    }
  }

  const accessToken = localStorage.getItem(keys.accessToken)

  const socket: TypeBoutSocket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1400',
    {
      auth: {
        accessToken,
        user
      }
    }
  )
  return socket
}
