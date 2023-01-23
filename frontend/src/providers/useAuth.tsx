import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as api from "../apicalls/index";
import { usePathname, useRouter} from 'next/navigation'
import { User } from '@/types'
import { refreshTokens } from "@/util/auth";
import { keys } from '@/util/localstoragekeys'

interface AuthContextProps {
  loading: boolean,
  error?: any
  login: (username: string, password: string) => void
}

const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
)

// I hate authentication but here we go: 
// Authentication utilizes access and refresh tokens, as described here:
// https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
// The nice part of this is that you store your longer lived refresh token
// in an http-only cookie, which can't be accessed by client side javascript.
// However: this is prone to xsrf, cross site request forgery. 
// Our access token, which is shorter lived resides in localStorage and 
// is sent in the request body and is thus not subject to xsrf,
// However it is prone to CSS, cross site scripting.

// Apparently some smart person came up with the pairing of the two, which is 
// supposedly safer. It is horrible to implement in practice:
// We use our refresh token to constantly refresh our access_token periodically.

export const AuthProvider = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User>()
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const path = usePathname()
  const { push }= useRouter()

  // If we switch to another page we reset error  
  useEffect(() => {
    if (error) {
      setError(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useEffect(() => {
    const time = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_SECONDS)*1000 || 30*1000
    const interval = setInterval(async () => {
      const successful = await refreshTokens()
      console.log('Token stuff', successful, localStorage.getItem(keys.accessToken))
      
      if (!successful) {
        console.log('access token not valid...')
        setUser(undefined)
        clearInterval(interval)
      }
    }, time)

    return () => {
      clearInterval(interval)
    }

  }, [user, push])

  const login = (username: string, password: string) => {
    setLoading(true)

    api.login({username, password})
      .then((res) => res.data)
      .then((res) => {
        const { accessToken, user } = res.data
        localStorage.setItem(keys.accessToken, accessToken)
        setUser(user)
    })
      .catch(error => { setError(error) })
      .finally(() => setLoading(false))
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
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
