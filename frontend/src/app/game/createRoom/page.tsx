'use client'
import styles from '../../page.module.css'
import { useState } from 'react'
import SocketGameComponentWrapper, {
  BeforeGameComponentProps
} from '../socketGameComponentWrapper'

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

export default SocketGameComponentWrapper(CreateRoom)
