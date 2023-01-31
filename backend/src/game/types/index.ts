import { Socket } from 'socket.io'

export interface Player {
  username: string
}

export interface User extends Player {
  id: number
  password: string
  createdAt: Date
}

export type Guest = Player

// Information presented to users when joining
// a room before the match has started
export interface UserInformation {
  username: string
  isGuest: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {
  roomInfo: (players: UserInformation[]) => void
}

export interface ClientToServerEvents {
  createRoom: (callback: (link: string) => void) => void
  joinRoom: (roomId: number, callback: (successful: boolean) => void) => void
}

export interface SocketData {
  id?: number
  username: string
  isGuest: boolean
  roomID: number | null
}

export type TypeBoutSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>
