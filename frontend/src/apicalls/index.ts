import { User, BaseResponse } from '@/types'
import redaxios from 'redaxios'

const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337'

export const login = async (params: {
  username: string,
  password: string
}) => {
  redaxios.defaults.withCredentials = true
  const response = await redaxios.post<BaseResponse>(url + '/users/login', {
    ...params,
    withCredentials: true
  }) 
  return response
}

export const refreshToken = async () => {
  redaxios.defaults.withCredentials = true
  return (await redaxios.post<BaseResponse>(url + '/users/refreshToken', {
    withCredentials: true 
  }))
}

export const logout = async () => {
  redaxios.defaults.withCredentials = true
  return (await redaxios.post<BaseResponse>(url + '/users/logout', {
    withCredentials: true 
  }))
}