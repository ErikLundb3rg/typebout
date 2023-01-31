'use client'
import styles from '../../page.module.css'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TypeBoutSocket, UserInformation } from '@/socket/types'
import useAuth from '@/providers/useAuth'
import { createSocket } from '@/socket/createSocket'
import BecomeGuest from '../becomeguest'

let socket: TypeBoutSocket | null = null

export default function JoinRoom() {
  const { user, isGuest } = useAuth()
  const searchParams = useSearchParams()
  const roomID = searchParams.get('room')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState<UserInformation[]>()

  useEffect(() => {
    ;(async () => {
      if (!user || roomID === null) return

      if (!socket) {
        socket = await createSocket(user, isGuest)
      }

      socket.emit('joinRoom', Number(roomID), (successful) => {
        if (!successful) {
          setError(true)
        }
        setLoading(false)
      })

      socket.on('roomInfo', (players) => {
        setPlayers(players)
      })
    })()

    return () => {
      socket = null
    }
  }, [user])

  if (!user) {
    return <BecomeGuest />
  }

  if (loading) {
    return (
      <div className={styles.description}>
        <p> Loading... </p>
      </div>
    )
  }

  return (
    <div className={styles.description}>
      <h2> Hi {user.username} </h2>
      {error ? (
        <p> Could not join room: {roomID} </p>
      ) : (
        <p> Successfully joined {roomID} </p>
      )}
      <h1> Entering room: {roomID} </h1>
      {players?.map((player) => {
        const { isGuest, username } = player
        return (
          <p>
            {' '}
            {username}: {isGuest && 'guest'}{' '}
          </p>
        )
      })}
    </div>
  )
}
