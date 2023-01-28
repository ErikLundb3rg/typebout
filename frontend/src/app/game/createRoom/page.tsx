'use client'
import styles from '../../page.module.css'
import useAuth from '@/providers/useAuth'
import BecomeGuest from './becomeguest'
import { useEffect, useState } from 'react'
import { createSocket } from '@/socket/createSocket'
import { TypeBoutSocket } from '@/socket/types'

let socket: TypeBoutSocket | null = null

export default function CreateRoom() {
  const { user, isGuest } = useAuth()
  const [link, setLink] = useState<string>()

  useEffect(() => {
    if (!user) return

    if (!socket) {
      socket = createSocket(user, isGuest)
    }

    return () => {
      socket = null
    }
  }, [user])

  const handleCreateRoom = () => {
    socket?.emit('createRoom', (link) => {
      console.log('creating room')
      setLink(link)
    })
  }

  if (!user) {
    return <BecomeGuest />
  }

  return (
    <div className={styles.description}>
      <h2> Hello {user.username} </h2>
      <p> We create rooms here: </p>
      {link ? (
        <div>
          <p> This is your link: </p>
          <p> {link} </p>
        </div>
      ) : (
        <button onClick={handleCreateRoom}> Click here </button>
      )}
      {}
    </div>
  )
}
