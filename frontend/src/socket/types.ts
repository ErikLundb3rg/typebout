import { Socket } from 'socket.io-client'

export interface Player {
  username: string
  id: number
  isGuest: boolean
}

// Information about the game sent continuosly
// to the clients
export interface GameInformation {
  wpm: number
  user: {
    username: string
    id: number
  }
  color: string
  progressPercentage: number
}

export interface EndGameStats {
  wpm: number
  user: {
    username: string
    id: number
  }
  time: number
  accuracy: number
  correct: number
  mistakes: number
  mistakeWords: string[]
  placement: number
  graphData: { wpm: number; rawWpm: number; time: number }[]
}

export interface MistakeProps {
  mistakes: number
  mistakeWords: string[]
}

export interface Quote {
  content: string
  author: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {
  roomInfo: (players: Player[]) => void
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
  sendWord: (word: string, mistakesObj?: MistakeProps) => void
  playAgainGame: () => void
}

export type TypeBoutSocket = Socket<ServerToClientEvents, ClientToServerEvents>
