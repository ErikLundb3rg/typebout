'use client'
import styles from '../../page.module.css'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SocketGameComponent, {
  BeforeGameComponentProps
} from '../socketGameComponentWrapper'

const JoinRoom = ({ players, socket, user }: BeforeGameComponentProps) => {
  const searchParams = useSearchParams()
  const roomID = searchParams.get('room')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    socket.emit('joinRoom', Number(roomID), (successful) => {
      if (!successful) {
        setError(true)
      }
      setLoading(false)
    })
  }, [user])

  if (loading) {
    return (
      <div className={styles.description}>
        <p> Joining room... </p>
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

export default SocketGameComponent(JoinRoom)
