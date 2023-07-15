import { Socket } from 'socket.io'
import { Group, PersonalGame } from '../logic/gameDirector'
import { Quotes } from '@prisma/client'

export interface Player {
  username: string
  id: number
  isGuest: boolean
}

// Information about the game sent continuously
// to the clients
export interface GameInformation {
  wpm: number
  user: Player
  color: string
  progressPercentage: number
}

export interface EndGameStats {
  wpm: number
  user: Player
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
  playAgainGame: () => void
  sendWord: (word: string, mistakesObj?: MistakeProps) => void
}

export interface SocketData {
  id?: number
  username: string
  isGuest: boolean
  roomID: string
  group: Group
  personalGame: PersonalGame
}

export type TypeBoutSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>
