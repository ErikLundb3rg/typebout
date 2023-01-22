'use client';

import styles from '../page.module.css'
import { socket } from '../../socket/instance'

export default function createRoom() {

  const handleCreateRoom = (e: any) => {
    console.log('socket, ', socket, " trying to create room")
    socket.emit('createRoom')
  }
  return (
      <div className={styles.description}>
        <p> We create rooms here:  </p>  
        <button onClick = {handleCreateRoom}> Click here </button>
      </div>
  )
}

