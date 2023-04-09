'use client'
import useAuth from '@/providers/useAuth'
import { useEffect, useState } from 'react'
import { createSocket } from '@/socket/createSocket'
import BecomeGuest from '@/components/becomeguest'
import PlayGame from '../../components/play'
import {
  EndGameStats,
  GameInformation,
  MistakeProps,
  Player,
  Quote,
  TypeBoutSocket
} from '@/socket/types'
import { Spinner } from '@chakra-ui/spinner'
import { Center } from '@chakra-ui/react'

let socket: TypeBoutSocket | undefined = undefined

export interface BeforeGameComponentProps {
  socket: TypeBoutSocket
  user: Player
  players: Player[] | undefined
}

export default function SocketGameComponentWrapper(
  BeforeGameComponent: React.FC<BeforeGameComponentProps>,
  isAdmin: boolean
) {
  return () => {
    const { user, loading } = useAuth()
    const [players, setPlayers] = useState<Player[]>()
    const [count, setCount] = useState<number>(5)
    const [quote, setQuote] = useState<Quote>()
    const [gameInfoArr, setGameInfoArr] = useState<GameInformation[]>([])
    const [endGameStatsArr, setEndGameStatsArr] = useState<EndGameStats[]>([])
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [hasSocket, setHasSocket] = useState<boolean>(false)
    const [restartGameCounter, setRestartGameCounter] = useState<number>(0)

    useEffect(() => {
      ;(async () => {
        if (!user) return

        if (!socket) {
          socket = await createSocket(user)
          setHasSocket(true)
        }
        socket?.on('roomInfo', (players) => {
          setPlayers(players)
        })
        socket?.on('prepareGame', (quote) => {
          setQuote(quote)
          // I reset state here in order to prepare for restarting of the game
          setCount(5)
          setGameInfoArr([])
          setEndGameStatsArr([])
          setGameStarted(false)
          setRestartGameCounter((prev) => prev + 1)
        })
        socket?.on('countdown', (count) => {
          setCount(count)
        })
        socket?.on('gameStarted', () => {
          setGameStarted(true)
        })
        socket?.on('gameInfo', (gameInfoArr) => {
          setGameInfoArr(gameInfoArr)
        })
        socket?.on('completedStats', (stats) => {
          setEndGameStatsArr(stats)
        })
      })()

      return () => {
        socket = undefined
      }
    }, [user])

    if (loading) {
      return (
        <Center>
          <Spinner />
        </Center>
      )
    }

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
          handlePlayAgain={() => {
            socket?.emit('playAgainGame')
          }}
          canRestartGame={isAdmin && players?.length === endGameStatsArr.length}
          key={restartGameCounter}
        />
      )
    }

    if (socket && hasSocket) {
      return (
        <BeforeGameComponent socket={socket} user={user} players={players} />
      )
    }

    return (
      <Center>
        <Spinner />
      </Center>
    )
  }
}
