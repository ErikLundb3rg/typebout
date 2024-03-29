import { keys } from '@/util/localstoragekeys'
import axios from 'axios'

export interface BaseResponse<T> {
  message: string | null
  data: T
  status: number
  ok: boolean
}

axios.defaults.withCredentials = true

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(keys.accessToken)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    const originalConfig = err.config

    if (
      originalConfig.url !== '/users/refreshToken' &&
      originalConfig.url !== '/users/login' &&
      err.response
    ) {
      // Our access token has expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        try {
          const res = await instance.post('/users/refreshToken')
          const { accessToken } = res.data.data
          localStorage.setItem(keys.accessToken, accessToken)

          return instance(originalConfig)
        } catch (error) {
          localStorage.removeItem(keys.accessToken)
          localStorage.removeItem(keys.user)
          location.href = '/'
          return Promise.reject(error)
        }
      }
    }

    return Promise.reject(err)
  }
)

export const login = async (username: string, password: string) =>
  await instance.post<BaseResponse<any>>('/users/login', {
    username,
    password
  })

export const register = async (
  username: string,
  password: string,
  confirmPassword: string,
  captcha: string
) =>
  await instance.post<BaseResponse<any>>('/users/register', {
    username,
    password,
    confirmPassword,
    captcha
  })

export const refreshToken = async () =>
  await instance.post<BaseResponse<any>>('/users/refreshToken')

export const logout = async () =>
  await instance.post<BaseResponse<any>>('/users/logout')

export const fetcherGet = <T>(url: string) =>
  instance.get<BaseResponse<T>>(url).then((res) => res.data)
