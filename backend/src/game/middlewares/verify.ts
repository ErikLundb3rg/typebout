import { ExtendedError } from 'socket.io/dist/namespace'
import { Player } from '../types/index'
import { verifyAccessToken, JWTPayload } from '../../auth/util/verifyers'
import { TypeBoutSocket } from '../types'

// This middleware will check if the connecting
// client has the status of a logged in User
// or Guest, and load the socket.data property
// accordingly

interface SocketAuthProps {
  accessToken: string
  user: Player
  isGuest: boolean
}

type SocketIOMiddleWareHandler = (
  socket: TypeBoutSocket,
  next: (err?: ExtendedError | undefined) => void
) => void
export const verifyConnection: SocketIOMiddleWareHandler = (socket, next) => {
  const { accessToken, user } = socket.handshake.auth as SocketAuthProps

  if (user.isGuest) {
    socket.data = {
      username: user.username,
      isGuest: true
    }
  } // Verify that the user is actually logged in and not just saying "i'm not a guest"
  else {
    try {
      const { userId, username } = verifyAccessToken(accessToken) as JWTPayload
      socket.data = {
        id: userId,
        username,
        isGuest: false
      }
    } catch (e) {
      console.error(
        'User is not a guest and does not provide a valid access token'
      )
    }
  }

  next()
}
