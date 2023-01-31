import { ClientToServerEvents, TypeBoutSocket } from '../types'

export type SocketHandler<fn extends keyof ClientToServerEvents> = (
  socket: TypeBoutSocket
) => ClientToServerEvents[fn]
