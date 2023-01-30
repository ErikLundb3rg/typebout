'use client'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import * as api from '../apicalls/index'
import { usePathname } from 'next/navigation'
import { Player } from '@/socket/types'
import { keys } from '@/util/localstoragekeys'

interface AuthContextProps {
  loading: boolean
  error?: any
  user: Player
  isGuest: boolean
  login: (username: string, password: string) => void
  logout: () => void
  becomeGuest: (username: string) => void
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

// I hate authentication but here we go:
// TypeBout utilizes access and refresh tokens, as described here:
// https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
// The nice part of this is that you store your longer lived refresh token
// in an http-only cookie, which can't be accessed by client side javascript.
// However: this is prone to xsrf, cross site request forgery.
// Our access token, which is shorter lived resides in localStorage and
// is sent in the request body and is thus not subject to xsrf,
// However it is prone to CSS, cross site scripting.

// Apparently some smart person came up with the pairing of the two, which is
// supposedly safer. It is horrible to implement in practice:
// We use axios intercept to try and refresh our tokens if our fetch fails

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<Player>()
  const [isGuest, setIsGuest] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const path = usePathname()

  // If we switch to another page we reset error
  useEffect(() => {
    if (error) {
      setError(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  // Reintroduce state if we refresh the page
  useEffect(() => {
    const user = localStorage.getItem(keys.user)
    if (user) {
      setUser(JSON.parse(user))
    }
    const isGuest = localStorage.getItem(keys.isGuest)
    console.log('retrieved, isguest', isGuest)
    if (isGuest) {
      console.log('setting isGuest', JSON.parse(isGuest))
      setIsGuest(JSON.parse(isGuest))
    }
  }, [])

  // Save user in localstorage whenever we update it
  useEffect(() => {
    user && localStorage.setItem(keys.user, JSON.stringify(user))
  }, [user])

  // Save if user is a guest in localstorage whenever we update it
  useEffect(() => {
    isGuest && localStorage.setItem(keys.isGuest, JSON.stringify(isGuest))
  }, [isGuest])

  const becomeGuest = (username: string) => {
    setUser({ username })
    setIsGuest(true)
  }

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = (await api.login(username, password)).data
      console.log('res', response)
      const { accessToken, user } = response.data
      localStorage.setItem(keys.accessToken, accessToken)
      setUser(user)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }

    if (isGuest) {
      setIsGuest(false)
      localStorage.removeItem(keys.isGuest)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      localStorage.removeItem(keys.accessToken)
      localStorage.removeItem(keys.user)
      setUser(undefined)
    } catch (error) {
      setError(error)
    }
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      becomeGuest,
      isGuest,
      logout
    }),
    [user, loading, error]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
