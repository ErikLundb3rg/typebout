import jwtDecode, { JwtPayload } from 'jwt-decode'
import { refreshToken } from '@/apicalls'
import { keys } from './localstoragekeys'

interface TokenProps {
  exp: number
}

// Tries to refresh the token and will update localstorage accordingly
export const tryRefreshToken = async () => {
  try {
    const res = await refreshToken()
    const { accessToken } = res.data.data
    localStorage.setItem(keys.accessToken, accessToken)
    return true
  } catch (error) {
    localStorage.removeItem(keys.accessToken)
    localStorage.removeItem(keys.user)
    return false
  }
}
