import { Socket } from 'socket.io-client'

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

// Information about the game sent continuosly
// to the clients
export interface GameInformation {
  wpm: number
  username: string
  color: string
  progressPercentage: number
}

export interface EndGameStats {
  wpm: number
  username: string
  correct: number
  mistakes: number
  mistakeWords: string[]
}

export interface Quote {
  content: string
  author: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {
  roomInfo: (players: UserInformation[]) => void
  sendWord: (word: string) => void
  // Telling client to set up the page for
  // the game
  prepareGame: (quote: Quote) => void
  countdown: (count: number) => void
  // Info about users progress sent during
  // the game
  gameInfo: (info: GameInformation[]) => void
  // Stats about the completed game
  completedStats: (info: EndGameStats[]) => void
  // This is for when the players are able to
  // start typing
  gameStarted: () => void
}

export interface ClientToServerEvents {
  createRoom: (callback: (link: string) => void) => void
  joinRoom: (roomId: string, callback: (successful: boolean) => void) => void
  startGame: () => void
  sendWord: (word: string) => void
}

export type TypeBoutSocket = Socket<ServerToClientEvents, ClientToServerEvents>
