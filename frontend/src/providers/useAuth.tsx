import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as api from "../apicalls/index";
import { usePathname} from 'next/navigation'
import { User } from '@/types'

interface AuthContextProps {
  loading: boolean,
  error?: any
  login: (username: string, password: string) => void
}

const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
)

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

  // If we switch to another page we do not anymore have an error  
  useEffect(() => {
    if (error) {
      setError(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  const login = (username: string, password: string) => {
    setLoading(true)

    api.login({username, password})
      .then((res) => res.data)
      .then((res) => {
        const { accessToken, user } = res.data

        if (res.ok) {
          console.log('received user', user)
          setUser(user)
        }
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
