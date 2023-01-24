'use client';

import useAuth from '@/providers/useAuth';
import { FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import styles from '@/app/page.module.css'


export default function Login() {
  const { login, loading, user, error } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    login(
      formData.get('username') as string, 
      formData.get('password') as string
    )
  }

  return (
    <div className = {styles.description}>
      {error && <p> Something went wrong in your input </p>}
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label>
          username 
          <input name="username" />
        </label>

        <label>
          Password
          <input name="password" type="password" />
        </label>

        <button disabled={loading}>Submit</button>

        {/*
          As I said above, these errors can happen for
          more reasons, like network errors.
          Control these as you desire!
          {error && <p className={styles.error}>Bad login/password</p>}
        */}

      </form>
    </div>
  )
}


