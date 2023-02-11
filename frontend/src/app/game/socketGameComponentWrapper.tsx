'use client'
import useAuth from '@/providers/useAuth'
import { useEffect, useState } from 'react'
import { createSocket } from '@/socket/createSocket'
import BecomeGuest from './becomeguest'
import PlayGame from './play'
import {
  EndGameStats,
  GameInformation,
  MistakeProps,
  Player,
  Quote,
  TypeBoutSocket,
  UserInformation
} from '@/socket/types'

let socket: TypeBoutSocket | null = null

export interface BeforeGameComponentProps {
  socket: TypeBoutSocket
  user: Player
  players: UserInformation[] | undefined
}

export default function SocketGameComponentWrapper(
  BeforeGameComponent: React.FC<BeforeGameComponentProps>
) {
  return () => {
    const { user, isGuest } = useAuth()
    const [players, setPlayers] = useState<UserInformation[]>()
    const [count, setCount] = useState<number>()
    const [quote, setQuote] = useState<Quote>()
    const [gameInfoArr, setGameInfoArr] = useState<GameInformation[]>([])
    const [endGameStatsArr, setEndGameStatsArr] = useState<EndGameStats[]>([])
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [hasSocket, setHasSocket] = useState<boolean>(false)

    useEffect(() => {
      ;(async () => {
        if (!user) return

        if (!socket) {
          socket = await createSocket(user, isGuest)
          setHasSocket(true)

          socket.on('roomInfo', (players) => {
            setPlayers(players)
          })
          socket.on('prepareGame', (quote) => {
            console.log('quote', quote)
            setQuote(quote)
          })
          socket.on('countdown', (count) => {
            setCount(count)
          })
          socket.on('gameStarted', () => {
            setGameStarted(true)
          })
          socket.on('gameInfo', (gameInfoArr) => {
            setGameInfoArr(gameInfoArr)
          })
          socket.on('completedStats', (stats) => {
            setEndGameStatsArr(stats)
          })
        }
      })()

      return () => {
        socket = null
      }
    }, [user])

    if (!user) {
      return <BecomeGuest />
    }

    if (socket && hasSocket && quote) {
      return (
        <PlayGame
          count={count!}
          quote={quote!}
          gameStarted={gameStarted}
          onCorrectWord={(word: string, mistakesObj?: MistakeProps) => {
            socket?.emit('sendWord', word, mistakesObj)
          }}
          gameInfoArr={gameInfoArr}
          endGameStats={endGameStatsArr}
        />
      )
    }

    if (socket && hasSocket) {
      return (
        <BeforeGameComponent socket={socket} user={user} players={players} />
      )
    }

    return <p> loading ...</p>
  }
}
