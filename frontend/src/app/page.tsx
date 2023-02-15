'use client'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import Link from 'next/link'
import useAuth from '@/providers/useAuth'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {user?.isGuest && <p> Guest </p>}
        {user && <p> Hello {user.username} </p>}
        <Link href="/users/login"> Login here </Link>
        <button onClick={logout}> Logout here </button>
        <Link href="/game/createRoom"> Create room here </Link>
      </div>
    </main>
  )
}
