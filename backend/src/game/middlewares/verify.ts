import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { Player } from '../types/game'
import { verifyAccessToken } from '../../auth/util/verifyers'
import { Users } from '@prisma/client'

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
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => void
export const verifyConnection: SocketIOMiddleWareHandler = (socket, next) => {
  const { accessToken, user, isGuest } = socket.handshake
    .auth as SocketAuthProps

  if (isGuest) {
    socket.data = {
      user,
      isGuest
    }
  } // Verify that the user is actually logged in and not just saying "i'm not a guest"
  else {
    try {
      const { id, username, createdAt } = verifyAccessToken(
        accessToken
      ) as Users
      socket.data = {
        user: {
          id,
          username,
          createdAt
        },
        isGuest
      }
    } catch (e) {
      console.error(
        'User is not a guest and does not provide a valid access token'
      )
    }
  }

  next()
}
