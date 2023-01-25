import styles from '../../page.module.css'
import { FormEvent } from 'react';
import useAuth from '@/providers/useAuth'

const BecomeGuest = () =>  {
  const { becomeGuest } = useAuth()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string | undefined
    if (username) {
      becomeGuest(username)
    }
  }

  return (
    <div className = {styles.description}>
      <form onSubmit={handleSubmit}>
        <h1>Play as guest</h1>

        <label>
          Before you can play, please enter your nickname: 
          <input name="username" />
        </label>
        <button> Submit</button>
      </form>
    </div>
  )
}

export default BecomeGuest