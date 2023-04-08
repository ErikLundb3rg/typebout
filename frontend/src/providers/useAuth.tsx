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
import { useRouter } from 'next/navigation'
import { SignUpError } from '@/types'
import { useToast } from '@chakra-ui/react'

interface AuthContextProps {
  loading: boolean
  user: Player | undefined
  login: (username: string, password: string) => Promise<string | null>
  networkError: string | undefined
  register: (
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<SignUpError | null>
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
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false)
  const [networkError, setNetworkError] = useState<string | undefined>(
    undefined
  )
  const path = usePathname()
  const router = useRouter()
  const toast = useToast()

  // If we switch to another page we reset error
  useEffect(() => {
    if (networkError) {
      setNetworkError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  // Reintroduce state if we refresh the page
  useEffect(() => {
    const user = localStorage.getItem(keys.user)
    if (user) {
      setUser(JSON.parse(user))
    } else {
      setUser(undefined)
    }
  }, [])

  // Save user in localstorage whenever we update it
  useEffect(() => {
    user && localStorage.setItem(keys.user, JSON.stringify(user))
  }, [user?.username, user?.isGuest])

  const becomeGuest = (username: string) => {
    setUser({ username, isGuest: true })
  }

  const login: AuthContextProps['login'] = async (username, password) => {
    setLoading(true)
    try {
      const response = (await api.login(username, password)).data
      const { accessToken, user } = response.data
      localStorage.setItem(keys.accessToken, accessToken)
      setUser({ username: user.username, isGuest: false })
      router.back()
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 1000,
        isClosable: true
      })
    } catch (error: any) {
      const { response } = error
      if (response) {
        return response.data.message
      } else {
        setNetworkError('Could not fetch resource')
      }
    } finally {
      setLoading(false)
    }
    return null
  }

  const register: AuthContextProps['register'] = async (
    username,
    password,
    confirmPassword
  ) => {
    let validationError: SignUpError | null = null
    setLoading(true)
    try {
      const response = (await api.register(username, password, confirmPassword))
        .data
      const { accessToken, user } = response.data
      localStorage.setItem(keys.accessToken, accessToken)
      setUser({ username: user.username, isGuest: false })
      router.push('/')
      toast({
        title: 'Signup successful',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (error: any) {
      const { response } = error
      if (response) {
        validationError = response.data.data.errors
      } else {
        setNetworkError('Could not fetch resource')
      }
    } finally {
      setLoading(false)
    }
    return validationError
  }

  const logout = async () => {
    localStorage.removeItem(keys.accessToken)
    localStorage.removeItem(keys.user)
    setUser(undefined)
    try {
      await api.logout()
    } catch (error) {}
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      networkError,
      login,
      becomeGuest,
      logout,
      register
    }),
    [user, loading, networkError]
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
