'use client'
import styles from '../../page.module.css'
import useAuth from '@/providers/useAuth'
import BecomeGuest from '../becomeguest'
import { useEffect, useState } from 'react'
import PlayGame from '../play'
import { createSocket } from '@/socket/createSocket'
import { TypeBoutSocket } from '@/socket/types'
import SocketGameComponent, {
  BeforeGameComponentProps
} from '../socketGameComponent'

let socket: TypeBoutSocket | null = null

const CreateRoom = ({ socket, user, players }: BeforeGameComponentProps) => {
  const [link, setLink] = useState<string>()

  const handleCreateRoom = () => {
    socket.emit('createRoom', (link) => {
      setLink(link)
    })
  }

  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return (
    <div className={styles.description}>
      <h2> Hello {user.username} </h2>
      <p> We create rooms here: </p>
      {link ? (
        <div>
          <p> This is your link: </p>
          <p> {link} </p>
          <button onClick={handleStartGame}> Start game </button>
        </div>
      ) : (
        <button onClick={handleCreateRoom}> Create room</button>
      )}
      {players?.map((player) => {
        const { isGuest, username } = player
        return (
          <p key={username}>
            {' '}
            {username}: {isGuest && 'guest'}{' '}
          </p>
        )
      })}
    </div>
  )
}

export default SocketGameComponent({ BeforeGameComponent: CreateRoom })
