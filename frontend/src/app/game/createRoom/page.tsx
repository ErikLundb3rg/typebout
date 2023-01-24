'use client';
import styles from '../../page.module.css'
import { socket } from '@/socket/instance'
import useAuth from '@/providers/useAuth'
import BecomeGuest from './becomeguest';

export default function CreateRoom() {
  const { user } = useAuth()

  console.log('user', user)
  if (!user) {
    return <BecomeGuest />
  }

  const handleCreateRoom = (e: any) => {
    console.log('socket, ', socket, " trying to create room")
    socket.emit('createRoom')
  }
  return (
      <div className={styles.description}>
        <h2> Hello {user.username} </h2>
        <p> We create rooms here:  </p>  
        <button onClick = {handleCreateRoom}> Click here </button>
      </div>
  )
}

