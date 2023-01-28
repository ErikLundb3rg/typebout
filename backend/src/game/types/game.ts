import { Socket } from 'socket.io'
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
} from './socket'
export interface Player {
  username: string
}

export interface User extends Player {
  id: number
  password: string
  createdAt: Date
}

export type Guest = Player

export type TypeBoutSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>
