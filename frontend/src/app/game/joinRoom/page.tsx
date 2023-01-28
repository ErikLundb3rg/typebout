'use client'
import styles from '../../page.module.css'
import { useSearchParams } from 'next/navigation'

export default function JoinRoom() {
  const searchParams = useSearchParams()
  const roomID = searchParams.get('room')

  return (
    <div className={styles.description}>
      <h1> Entering room: {roomID} </h1>
    </div>
  )
}
