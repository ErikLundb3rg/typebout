import { Socket } from "socket.io-client"

export interface ServerToClientEvents {
}

export interface ClientToServerEvents {
  createRoom: (callback: (link: string) => void) => void
}

export interface SocketData {
  username: string
  isGuest: boolean
}

export type TypeBoutSocket = Socket<ServerToClientEvents, ClientToServerEvents>