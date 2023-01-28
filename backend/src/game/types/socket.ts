import { Player } from './game'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {
  roomInfo: (players: Player[]) => void
}

export interface ClientToServerEvents {
  createRoom: (callback: (link: string) => void) => void
  joinRoom: (roomId: number, callback: (successful: boolean) => void) => void
}

export interface SocketData {
  username: string
  isGuest: boolean
}
