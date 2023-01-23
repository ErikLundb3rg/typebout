import { Inter } from '@next/font/google'
import styles from './page.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Link href = '/users/login'> Login here! </Link>
        <Link href = '/users/register'> Sign up here! </Link>
        <p> Hi </p>  
      </div>
    </main>
  )
}
