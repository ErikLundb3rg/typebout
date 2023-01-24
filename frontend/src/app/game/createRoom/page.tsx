'use client';

import useAuth from '@/providers/useAuth';
import { socket } from '@/socket/instance'
import styles from '../../page.module.css'

export default function CreateRoom() {
  const { user } = useAuth();

  if (!user) {


  }

  const handleCreateRoom = (e: any) => {
    console.log('socket, ', socket, " trying to create room")
    socket.emit('createRoom')
  }

  return (
      <div className={styles.description}>
        <p> We create rooms here: </p>  
        <button onClick = {handleCreateRoom}> Create room </button>
      </div>
  )
}


