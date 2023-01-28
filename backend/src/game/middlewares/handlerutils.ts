import { Socket } from 'socket.io'
import { ClientToServerEvents } from '../types/socket'

export type SocketHandler<fn extends keyof ClientToServerEvents> = (
  socket: Socket
) => ClientToServerEvents[fn]
