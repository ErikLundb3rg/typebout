import { Socket } from 'socket.io'
import { ClientToServerEvents } from '../types'

export type SocketHandler<fn extends keyof ClientToServerEvents> = (
  socket: Socket
) => ClientToServerEvents[fn]
