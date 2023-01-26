// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  createRoom: (callback: (link: string) => void) => void
}

export interface SocketData {
  username: string
  isGuest: boolean
}
